<?php

namespace App\Service;

use League\OAuth2\Client\Provider\Google;
use League\OAuth2\Client\Provider\GoogleUser;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class GoogleAuthenticator
{
    private Google $provider;
    private SessionInterface $session;

    public function __construct(RequestStack $requestStack)
    {
        $this->session = $requestStack->getSession();
        
        $this->provider = new Google([
            'clientId' => $_ENV['GOOGLE_CLIENT_ID'],
            'clientSecret' => $_ENV['GOOGLE_CLIENT_SECRET'],
            'redirectUri' => $_ENV['GOOGLE_REDIRECT_URI'],
        ]);
    }

    public function getAuthUrl(): string
    {
        $options = [
            'scope' => [
                'email',
                'profile',
                'openid'
            ]
        ];

        $authUrl = $this->provider->getAuthorizationUrl($options);
        
        $this->session->set('oauth2state', $this->provider->getState());
        
        return $authUrl;
    }

    public function handleCallback(Request $request): ?GoogleUser
    {
        $code = $request->query->get('code');
        $state = $request->query->get('state');

        $savedState = $this->session->get('oauth2state');
        if (!$state || !$savedState || $state !== $savedState) {
            return null;
        }

        try {
            $token = $this->provider->getAccessToken('authorization_code', [
                'code' => $code
            ]);

            return $this->provider->getResourceOwner($token);
            
        } catch (\Exception $e) {
            return null;
        }
    }
}