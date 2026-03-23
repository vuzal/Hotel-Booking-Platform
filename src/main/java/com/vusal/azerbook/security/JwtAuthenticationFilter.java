package com.vusal.azerbook.security;

import com.vusal.azerbook.service.JwtService;
import com.vusal.azerbook.service.impl.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = getTokenFromRequest(request);

            if (StringUtils.hasText(token)) {
                // Əgər token keçərlidirsə, içəri buraxırıq
                if (jwtService.validateAccessToken(token)) {
                    String email = jwtService.extractEmailFromAccessToken(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // DİQQƏT: Token var, amma keçərsizdir (vaxtı bitib və s.). Dərhal 401 qaytar!
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Xətası
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\": \"Access token expired or invalid\"}");
                    return; // filterChain.doFilter-ə keçməsin deyə prosesi burada qırırıq!
                }
            }
        } catch (Exception e) {
            // Əgər jjwt kitabxanası vaxtı bitəndə ExpiredJwtException atırsa, o bura düşəcək
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Xətası
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Access token expired\"}");
            return; // Yenə prosesi qırırıq
        }

        // Əgər ümumiyyətlə token yoxdursa (ictimai səhifədirsə) normal davam edir
        filterChain.doFilter(request, response);
    }
}
