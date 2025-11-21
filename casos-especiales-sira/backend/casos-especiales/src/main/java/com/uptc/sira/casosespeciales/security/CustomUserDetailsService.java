package com.uptc.sira.casosespeciales.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.sira.casosespeciales.entity.Usuario;
import com.uptc.sira.casosespeciales.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UsuarioRepository usuarioRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String codigoUsuario) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCodigoUsuario(codigoUsuario)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con código: " + codigoUsuario));
        
        return User.builder()
                .username(usuario.getCodigoUsuario())
                .password(usuario.getPasswordHash())
                .authorities(getAuthorities(usuario))
                .accountExpired(false)
                .accountLocked(!usuario.getActivo())
                .credentialsExpired(false)
                .disabled(!usuario.getActivo())
                .build();
    }
    
    private Collection<? extends GrantedAuthority> getAuthorities(Usuario usuario) {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()));
    }
}
