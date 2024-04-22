<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $credit = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                    FROM pools
                    WHERE PaymentMethod = "Credit"
                    GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                                FROM salles
                                WHERE PaymentMethod = "Credit"
                                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                                FROM traiteur_totals
                                WHERE PaymentMethod = "Credit"
                                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS Credit')
                ->get();

                $cash = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                    FROM pools
                    WHERE PaymentMethod = "pay cash"
                    GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                                FROM salles
                                WHERE PaymentMethod = "pay cash"
                                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                                FROM traiteur_totals
                                WHERE PaymentMethod = "pay cash"
                                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS Cash')
                ->get();

            // $credit = Client::leftJoin('traiteur_totals', 'clients.id', '=', 'traiteur_totals.ClientId')
            //     ->where('traiteur_totals.PaymentMethod', 'Credit')
            //     ->sum('traiteur_totals.Total');

            // $cash = Client::leftJoin('traiteur_totals', 'clients.id', '=', 'traiteur_totals.ClientId')
            //     ->where('traiteur_totals.PaymentMethod', 'pay cash')
            //     ->sum('traiteur_totals.Total');

            return response()->json(["response" => [
                $credit, $cash
            ]]);
        } catch (\Exception $e) {
            Log::error("The error in ClientController => index: " . $e->getMessage());
            return response()->json(["err" => "An error in the server try later"]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
