export interface ServiceOAuthConstants {
    clientId: string;
    redirectUri: string;
    scopes: string[];
    oAuthSessionId: string;
}

export const servicesAuthorize: { [key: string]: string }[] = [
    { spotify: 'https://accounts.spotify.com/authorize' },
    { google: 'https://accounts.google.com/o/oauth2/v2/auth'},
    { discord: 'https://discord.com/api/oauth2/authorize'},
    { github: 'https://github.com/login/oauth/authorize'},
    { twitch: 'https://id.twitch.tv/oauth2/authorize'},
];

export function getServiceAuthorizeByName(key: string): string | undefined {
    const item = servicesAuthorize.find(obj => obj.hasOwnProperty(key));

    return item ? item[key] : undefined;
}
  
