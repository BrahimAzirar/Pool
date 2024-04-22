<?php

namespace App\Http\Controllers;

use App\Models\CalculPreson;
use App\Models\Client;
use App\Models\Depenses;
use App\Models\Pool;
use App\Models\Salle;
use App\Models\traiteur_total;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CalculPresonController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $response = [];
            $credits = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
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
                ->select('clients.id AS ClientId')
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
                ->select('clients.id AS ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS Cash')
                ->get();

            $check = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                FROM pools
                WHERE PaymentMethod = "Payment by check"
                GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                FROM salles
                WHERE PaymentMethod = "Payment by check"
                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                FROM traiteur_totals
                WHERE PaymentMethod = "Payment by check"
                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->select('clients.id as ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS PaymentByCheck')
                ->get();

            $successive = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                    FROM pools
                    WHERE PaymentMethod = "successive payments"
                    GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                                FROM salles
                                WHERE PaymentMethod = "successive payments"
                                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                                FROM traiteur_totals
                                WHERE PaymentMethod = "successive payments"
                                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->select('clients.id AS ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS Successive')
                ->get();



            return response()->json(["response" => [
                $credits, $cash, $successive, $check
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
    public function show(CalculPreson $calculPreson)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CalculPreson $calculPreson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CalculPreson $calculPreson)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CalculPreson $calculPreson)
    {
        //
    }
}
