<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\IdeaInsight;
use App\Services\IdeaInsightAIService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IdeaInsightController extends Controller
{
    protected $aiService;

    public function __construct(IdeaInsightAIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Menampilkan halaman utama idea insight dengan riwayat chat
     */
    public function index()
    {
        $userIdeaChat = IdeaInsight::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('idea-insight', [
            'userIdeaChat' => $userIdeaChat
        ]);
    }

    /**
     * Memproses chat dengan AI dan menyimpan ke database
     */
    public function chat(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.message' => 'required|string',
        ]);

        try {
            $messages = $request->messages;
            $aiResponse = $this->aiService->generateResponse($messages);

            if (Auth::check()) {
                $this->saveMessages($messages, $aiResponse);
            }

            return response($aiResponse, 200, ['Content-Type' => 'text/plain']);
        } catch (\Exception $e) {
            return response('Maaf, terjadi kendala saat memproses. Coba lagi sebentar ya, atau ringkas ide kamu.', 500);
        }
    }

    /**
     * Menyimpan pesan user dan AI ke database
     */
    private function saveMessages($messages, $aiResponse)
    {
        $userMessage = end($messages)['message'];

        IdeaInsight::create([
            'message' => $userMessage,
            'is_ai_generated' => false,
            'user_id' => Auth::id(),
        ]);

        IdeaInsight::create([
            'message' => $aiResponse,
            'is_ai_generated' => true,
            'user_id' => Auth::id(),
        ]);
    }

    /**
     * Mengekspor percakapan menjadi draft forum atau kolaborasi
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:forum,collab',
            'transcript' => 'required|array',
            'current' => 'sometimes|array',
        ]);

        try {
            $type = $request->type;

            if ($request->has('current')) {
                return $this->createDraft($type, $request->current);
            }

            $draftData = $this->aiService->generateDraftFromTranscript($type, $request->transcript);
            return $this->createDraft($type, $draftData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal membuat draft'], 500);
        }
    }

    /**
     * Menyimpan draft data ke session untuk penggunaan sementara
     */
    private function createDraft($type, $data)
    {
        $draftId = Str::uuid();
        session()->put("draft_{$type}_{$draftId}", $data);

        return response()->json([
            'id' => $draftId,
            'type' => $type,
            'data' => $data,
        ]);
    }
}
