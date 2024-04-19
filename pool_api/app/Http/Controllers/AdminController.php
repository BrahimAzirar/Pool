<?php

/*

for make the session auth using Laravel api must create a middleware for
allows the session auth using api visit app/Http/kernal.php for understand.
and after create the middleware must intergrate it with the auth route

*/


namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use App\Models\admin;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function AdminIsExist(Request $request): JsonResponse
    {
        try {
            $username = $request -> Username;
            $password = $request -> Password;
            $sycret = env('ENCRYPTION_KEY');
            $results = DB::select("
                SELECT *
                FROM admins
                WHERE Username = :username
                AND Password = AES_ENCRYPT(:password, :sycret)
            ", [
                'username' => $username,
                'password' => $password,
                'sycret' => $sycret
            ]);

            if ($results) {
                $request -> session() -> put('isAuth', true);
                return response() -> json(['response' => true]);
            } else {
                return response() -> json(['response' => false]);
            };
        } catch (\Exception $e) {
            Log::error("The error from AdminController in AdminIsExist(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    function AdminIsAuth(Request $request) : JsonResponse {
        try {
            $isAuthenticated = $request->session()->get('isAuth');
            return response() -> json(['response' => $isAuthenticated]);
        } catch (\Exception $e) {
            Log::error("The error from AdminController in AdminIsAuth(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    function Logout(Request $request) : JsonResponse {
        try {
            Session::flush();
            return response() -> json(['response' => true]);
        } catch (\Exception $e) {
            Log::error("The error from AdminController in OnAppClose(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function update(Request $request, admin $admin): JsonResponse
    {
        try {
            $admin -> Username = $request -> Username;
            $admin -> Password = Hash::make($request -> Password);
            $admin -> save();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from AdminController in update(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

}
