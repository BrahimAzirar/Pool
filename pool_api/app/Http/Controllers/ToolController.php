<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Tool::latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $tool = new Tool();
            $tool -> name = $request -> name;
            $tool -> save();

            return response() -> json([ "response" => $tool -> id ]);
        } catch (\Exception $e) {
            return response() -> json([ "response" => $e -> getMessage() ]);
        }
    }

    public function show(Tool $tool)
    {
        //
    }

    public function update(Request $request, Tool $tool)
    {
        $tool->name = $request->name;
        $tool->save();
        return response()->json(true);
    }

    public function destroy(Tool $tool)
    {
        $tool->delete();
        return response()->json(true);
    }
}
