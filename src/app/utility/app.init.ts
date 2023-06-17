
import { KeycloakService } from 'keycloak-angular';
import { map } from 'rxjs/operators';
import { AuthConfigService } from '../authentication/auth-config.service';

export function initializeKeycloak(keycloak: KeycloakService, configService: AuthConfigService) {
    return () =>
        configService.getConfig()
            .pipe(
                map((config) => {
                    console.log('conf---', config);
                    if (config && config.keycloak) {
                        return keycloak.init({
                            config: {
                                url: config['keycloak']['url'],
                                realm: config['keycloak']['realm'],
                                clientId: config['keycloak']['clientId'],
                            },
                            initOptions: {
                                checkLoginIframe: true,
                                checkLoginIframeInterval: 25
                            },
                            loadUserProfileAtStartUp: true
                        });
                    }
                })
            ).toPromise();
}