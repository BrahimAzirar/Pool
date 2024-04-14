<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $Clients = Client::all();
            return response() -> json(['response' => $Clients]);
        } catch (\Exception $e) {
            Log::error("The error in ClientController => index: ". $e->getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $client = new Client();

            $client -> ClientCIN = $request -> input("ClientCIN");
            $client -> FirstName = $request -> input("FirstName");
            $client -> LastName = $request -> input("LastName");
            $client -> Thel = $request -> input("Thel");
            $client -> Email = $request -> input("Email");
            $client -> isClient = $request -> input("IsClient");
            $client -> isSupplier = $request -> input("IsSupplier");

            $client -> save();

            return response() -> json(["response" => $client -> id]);
        } catch (\Exception $e) {
            Log::error("The error in ClientController => store: ". $e->getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }


    public function update(Request $request, Client $client)
    {
        try {
            $client->ClientCIN = $request->ClientCIN;
            $client->FirstName = $request->FirstName;
            $client->LastName = $request->LastName;
            $client->Email = $request->Email;
            $client->Thel = $request->Thel;

            $client->save();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in ClientController => update: ". $e->getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function destroy(Client $client): JsonResponse
    {
        try {
            $client -> delete();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in ClientController => destroy: ". $e->getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }
}
