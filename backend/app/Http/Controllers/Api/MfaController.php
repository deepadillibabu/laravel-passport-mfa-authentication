<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;

class MfaController extends Controller
{
    public function setup(Request $request)
    {
        $user = $request->user();

        $google2fa = new Google2FA();

        $secret = $google2fa->generateSecretKey();

        $user->update([
            'mfa_secret' => $secret,
            'mfa_enabled' => false,
        ]);

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'message' => 'MFA setup initiated',
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
        ]);
    }


    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $user = $request->user();

        if (!$user->mfa_secret) {
            return response()->json([
                'message' => 'MFA setup has not been started',
            ], 400);
        }

        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey(
            $user->mfa_secret,
            $request->code
        );

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid MFA code',
            ], 422);
        }

        $user->update([
            'mfa_enabled' => true,
        ]);

        return response()->json([
            'message' => 'MFA enabled successfully',
        ]);
    }
}
