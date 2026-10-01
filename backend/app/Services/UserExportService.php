<?php

namespace App\Services;

use App\Models\User;

class UserExportService
{
    public function download(?string $search = null)
    {
        $users = $this->getUsers($search);

        return response()->streamDownload(function () use ($users) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, $this->headings());

            foreach ($users as $user) {
                fputcsv($handle, $this->map($user));
            }

            fclose($handle);
        }, 'users.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function getUsers(?string $search)
    {
        return User::select('id', 'name', 'email', 'created_at')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'ILIKE', '%' . $search . '%')
                        ->orWhere('email', 'ILIKE', '%' . $search . '%');
                });
            })
            ->get();
    }

    private function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Created At',
        ];
    }

    private function map(User $user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            $user->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}