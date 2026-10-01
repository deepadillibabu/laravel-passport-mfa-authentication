<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserExportService;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    //
    public function index(Request $request)
    {
        $search = $request->query('search');
        $users = User::select(
            'id',
            'name',
            'email',
            'created_at'
        )
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'ILIKE', '%' . $search . '%')
                        ->orWhere('email', 'ILIKE', '%' . $search . '%');
                });
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function exportCsv(Request $request, UserExportService $exportService)
    {
        return $exportService->download(
            $request->query('search')
        );
    }
}
