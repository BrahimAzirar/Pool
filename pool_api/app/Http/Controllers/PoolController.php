<?php

namespace App\Http\Controllers;

use App\Models\Pool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PoolController extends Controller
{
    function show($date): JsonResponse {
        try {
            $data = Pool::where("poolDate", $date) -> get();
            return response() -> json(["response" => $data]);
        } catch (\Exception $e) {
            Log::error("The error from PoolController in show(): ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            Pool::insert($request -> all());
            $maxId = Pool::pluck('id')->max();
            return response() -> json(["response" => $maxId]);
        } catch (\Exception $e) {
            Log::error("The error from PoolController in store(): ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function update(Request $request, Pool $pool)
    {
        try {
            $pool->offer = $request->offer;
            $pool->add_person = $request->person;
            $pool->SelectedClient = 0;
            $pool->save();
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from PoolController in update(): ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function destroy(Pool $pool): JsonResponse
    {
        try {
            $pool -> delete();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from PoolController in destroy(): ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }
}
