<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SalleController extends Controller
{
    public function index()
    {
        try {
            $data = Salle::where("is_salle", 0)->latest()->get();
            return response()->json(["response" => $data]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in index(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function index_salle()
    {
        try {
            $data = Salle::where("is_salle", 1)->latest()->get();
            return response()->json(["response" => $data]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in index(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $id = Salle::create([
                'ClientId' => $request -> ClientId,
                'price' => $request -> price,
                'date_start' => $request-> date_start,
                'date_end' => $request -> date_end,
                'is_salle' => $request -> is_salle,
            ]);

            return response() -> json(["response" => $id -> id]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in store(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function update(Request $request, Salle $salle) : JsonResponse
    {
        try {
            $salle -> ClientId = $request -> ClientId;
            $salle -> price = $request -> price;
            $salle -> date_start = $request-> date_start;
            $salle -> date_end = $request-> date_end;
            $salle -> save();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in update(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function destroy(Salle $salle): JsonResponse
    {
        try {
            $salle -> delete();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in destroy(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }
}
