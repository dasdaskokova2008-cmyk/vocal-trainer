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

    /**
     * Получить URL для авторизации через Google
     */
    public function getAuthUrl(): string
    {
        // Список запрашиваемых данных
        $options = [
            'scope' => [
                'email',
                'profile',
                'openid'
            ]
        ];

        $authUrl = $this->provider->getAuthorizationUrl($options);
        
        // Сохраняем state для защиты от CSRF
        $this->session->set('oauth2state', $this->provider->getState());
        
        return $authUrl;
    }

    /**
     * Обработать callback от Google и получить данные пользователя
     */
    public function handleCallback(Request $request): ?GoogleUser
    {
        $code = $request->query->get('code');
        $state = $request->query->get('state');

        // Проверка state для защиты от CSRF
        $savedState = $this->session->get('oauth2state');
        if (!$state || !$savedState || $state !== $savedState) {
            return null;
        }

        try {
            // Получаем токен
            $token = $this->provider->getAccessToken('authorization_code', [
                'code' => $code
            ]);

            // Получаем данные пользователя
            return $this->provider->getResourceOwner($token);
            
        } catch (\Exception $e) {
            return null;
        }
    }
}