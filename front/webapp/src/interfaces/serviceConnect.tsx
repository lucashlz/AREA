export interface ServiceOAuthConstants {
    clientId: string;
    redirectUri: string;
    scopes: string[];
    oAuthSessionId: string;
}

export const servicesAuthorize: { [key: string]: string }[] = [
    { spotify: 'https://accounts.spotify.com/authorize' },
];

export function getServiceAuthorizeByName(key: string): string | undefined {
    const item = servicesAuthorize.find(obj => obj.hasOwnProperty(key));

    return item ? item[key] : undefined;
}
  
