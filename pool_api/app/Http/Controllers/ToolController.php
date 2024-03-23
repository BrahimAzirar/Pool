<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ToolController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            return response() -> json(["response" => Tool::latest()->get()]);
        } catch (\Exception $e) {
            Log::error("The error in ToolController => index: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $tool = new Tool();
            $tool -> name = $request -> name;
            $tool -> save();

            return response() -> json([ "response" => $tool -> id ]);
        } catch (\Exception $e) {
            Log::error("The error in ToolController => store: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function show(Tool $tool) {}

    public function update(Request $request, Tool $Tool)
    {
        try {
            $Tool->name = $request -> toolName;
            $Tool->save();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in ToolController => update: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function destroy(Tool $tool): JsonResponse
    {
        try {
            $tool -> delete();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in ToolController => destroy: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }
}
