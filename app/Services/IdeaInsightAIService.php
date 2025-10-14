<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class IdeaInsightAIService
{
    private $aiApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private $aiModel = 'alibaba/tongyi-deepresearch-30b-a3b:free';

    /**
     * Menghasilkan respons AI berdasarkan pesan pengguna
     */
    public function generateResponse($messages)
    {
        $apiMessages = $this->formatMessagesForApi($messages);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
            'Content-Type' => 'application/json',
        ])->timeout(30)->post($this->aiApiUrl, [
            'model' => $this->aiModel,
            'messages' => $apiMessages,
        ]);

        if (!$response->successful()) {
            throw new \Exception('AI API request failed');
        }

        $data = $response->json();
        return $data['choices'][0]['message']['content'] ?? 'Maaf, saya tidak dapat memproses permintaan ini.';
    }

    /**
     * Memformat pesan untuk dikirim ke API AI
     */
    private function formatMessagesForApi($messages)
    {
        $apiMessages = [
            [
                'role' => 'system',
                'content' => 'Kamu adalah AI Idea Companion bernama Mira yang membantu pengguna mengembangkan ide kreatif dan brilian. Berikan respon yang supportif, konstruktif, dan membantu pengguna untuk mewujudkan ide mereka. Fokus pada aspek praktis, kolaborasi, dan dampak sosial. Gunakan bahasa Indonesia yang ramah dan mudah dipahami.'
            ]
        ];

        foreach ($messages as $index => $msg) {
            $isLastMessage = ($index === count($messages) - 1);
            $isUserMessage = $isLastMessage || ($index % 2 === 0);

            $apiMessages[] = [
                'role' => $isUserMessage ? 'user' : 'assistant',
                'content' => $msg['message']
            ];
        }

        return $apiMessages;
    }

    /**
     * Menghasilkan draft dari transkrip percakapan
     */
    public function generateDraftFromTranscript($type, $transcript)
    {
        $conversationText = $this->extractConversationText($transcript);

        if ($type === 'forum') {
            return $this->generateForumDraft($conversationText, $transcript);
        } else {
            return $this->generateCollabDraft($conversationText, $transcript);
        }
    }

    /**
     * Mengekstrak teks percakapan dari transkrip
     */
    private function extractConversationText($transcript)
    {
        $userMessages = array_filter($transcript, function ($msg) {
            return !$msg['isAiGenerated'];
        });

        return implode('\n\n', array_map(function ($msg) {
            return $msg['message'];
        }, $userMessages));
    }

    /**
     * Mengekstrak informasi dengan bantuan AI
     */
    private function extractWithAI($conversationText, $type)
    {
        try {
            $prompt = $this->buildExtractionPrompt($conversationText, $type);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($this->aiApiUrl, [
                'model' => $this->aiModel,
                'messages' => [
                    ['role' => 'system', 'content' => 'Kamu adalah AI yang membantu mengekstrak dan menyusun informasi dari percakapan. Berikan response dalam format JSON yang valid.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json()['choices'][0]['message']['content'] ?? '';

                // Try to extract JSON from response
                $jsonStart = strpos($aiResponse, '{');
                $jsonEnd = strrpos($aiResponse, '}');

                if ($jsonStart !== false && $jsonEnd !== false) {
                    $jsonString = substr($aiResponse, $jsonStart, $jsonEnd - $jsonStart + 1);
                    $extracted = json_decode($jsonString, true);

                    if ($extracted) {
                        return $extracted;
                    }
                }
            }
        } catch (\Exception $e) {
            Log::info('AI extraction failed, using fallback');
        }

        return null;
    }

    /**
     * Membuat prompt untuk ekstraksi informasi
     */
    private function buildExtractionPrompt($conversationText, $type)
    {
        if ($type === 'forum') {
            return "Analisis percakapan berikut dan ekstrak informasi untuk membuat forum diskusi:\n\n{$conversationText}\n\nBerikan response dalam format JSON dengan struktur:\n{\n  \"title\": \"judul yang menarik\",\n  \"category\": \"Teknologi/Sosial/Kreatif/Lingkungan/Ekonomi\",\n  \"summary\": \"ringkasan 1-2 kalimat\",\n  \"content\": \"deskripsi lengkap untuk diskusi forum\",\n  \"tags\": [\"tag1\", \"tag2\", \"tag3\"]\n}";
        } else {
            return "Analisis percakapan berikut dan ekstrak informasi untuk membuat proyek kolaborasi:\n\n{$conversationText}\n\nBerikan response dalam format JSON dengan struktur:\n{\n  \"title\": \"judul proyek\",\n  \"problem\": \"masalah yang ingin dipecahkan\",\n  \"goals\": [\"tujuan1\", \"tujuan2\"],\n  \"roles\": [{\"name\": \"Developer\", \"skills\": [\"Programming\", \"Web Dev\"], \"time\": \"10 jam/minggu\"}],\n  \"timeline\": \"estimasi waktu dan tahapan\",\n  \"links\": []\n}";
        }
    }

    /**
     * Menghasilkan draft forum
     */
    private function generateForumDraft($conversationText, $transcript)
    {
        $structuredData = $this->extractWithAI($conversationText, 'forum');

        if ($structuredData) {
            return $structuredData;
        }

        return [
            'title' => $this->extractTitle($conversationText),
            'category' => $this->detectCategory($conversationText),
            'summary' => Str::limit($conversationText, 200),
            'content' => $conversationText,
            'tags' => $this->extractTags($conversationText),
        ];
    }

    /**
     * Menghasilkan draft kolaborasi
     */
    private function generateCollabDraft($conversationText, $transcript)
    {
        $structuredData = $this->extractWithAI($conversationText, 'collab');

        if ($structuredData) {
            return $structuredData;
        }

        return [
            'title' => $this->extractTitle($conversationText),
            'problem' => Str::limit($conversationText, 300),
            'goals' => $this->extractGoals($conversationText),
            'roles' => $this->generateDefaultRoles($conversationText),
            'timeline' => $this->generateTimeline($conversationText),
            'links' => [],
        ];
    }

    /**
     * Mengekstrak judul dari teks
     */
    private function extractTitle($text)
    {
        $sentences = preg_split('/[.!?]+/', $text);

        foreach ($sentences as $sentence) {
            $sentence = trim($sentence);
            if (strlen($sentence) > 20 && strlen($sentence) < 100) {
                return Str::limit($sentence, 80);
            }
        }

        $firstSentence = trim(explode('.', $text)[0]);
        return Str::limit($firstSentence, 80) ?: 'Ide Baru dari Mari Berpikir';
    }

    /**
     * Mendeteksi kategori berdasarkan teks
     */
    private function detectCategory($text)
    {
        $categories = [
            'Teknologi' => ['teknologi', 'aplikasi', 'digital', 'software', 'web', 'mobile', 'ai', 'machine learning'],
            'Sosial' => ['sosial', 'masyarakat', 'komunitas', 'edukasi', 'pendidikan', 'kesehatan'],
            'Lingkungan' => ['lingkungan', 'plastik', 'sampah', 'pohon', 'hijau', 'sustainable'],
            'Ekonomi' => ['bisnis', 'ekonomi', 'startup', 'usaha', 'keuangan', 'investasi'],
            'Kreatif' => ['kreatif', 'seni', 'desain', 'musik', 'film', 'budaya']
        ];

        $text = strtolower($text);
        $scores = [];

        foreach ($categories as $category => $keywords) {
            $score = 0;
            foreach ($keywords as $keyword) {
                $score += substr_count($text, $keyword);
            }
            $scores[$category] = $score;
        }

        $maxCategory = array_keys($scores, max($scores))[0];
        return max($scores) > 0 ? $maxCategory : 'Kreatif';
    }

    /**
     * Mengekstrak tag dari teks
     */
    private function extractTags($text)
    {
        $allKeywords = [
            'teknologi', 'aplikasi', 'digital', 'web', 'mobile', 'sosial', 'masyarakat',
            'komunitas', 'edukasi', 'pendidikan', 'lingkungan', 'plastik', 'sampah',
            'hijau', 'sustainable', 'bisnis', 'ekonomi', 'startup', 'usaha', 'kreatif',
            'seni', 'desain', 'inovasi', 'kolaborasi'
        ];

        $text = strtolower($text);
        $foundTags = [];

        foreach ($allKeywords as $keyword) {
            if (stripos($text, $keyword) !== false) {
                $foundTags[] = $keyword;
            }
        }

        return array_slice(array_unique($foundTags), 0, 5);
    }

    /**
     * Mengekstrak tujuan dari teks
     */
    private function extractGoals($text)
    {
        $defaultGoals = ['Mengembangkan solusi', 'Melakukan riset', 'Membuat prototipe'];

        if (stripos($text, 'membuat') !== false) {
            $defaultGoals[] = 'Membuat produk atau layanan';
        }
        if (stripos($text, 'membantu') !== false) {
            $defaultGoals[] = 'Membantu masyarakat';
        }

        return array_slice(array_unique($defaultGoals), 0, 4);
    }

    /**
     * Menghasilkan peran default berdasarkan teks
     */
    private function generateDefaultRoles($text)
    {
        $roles = [
            ['name' => 'Project Manager', 'skills' => ['Manajemen Proyek', 'Komunikasi'], 'time' => '8 jam/minggu'],
        ];

        $text = strtolower($text);

        if (stripos($text, 'aplikasi') !== false || stripos($text, 'web') !== false) {
            $roles[] = ['name' => 'Developer', 'skills' => ['Programming', 'Web Development'], 'time' => '12 jam/minggu'];
            $roles[] = ['name' => 'UI/UX Designer', 'skills' => ['Design', 'User Research'], 'time' => '8 jam/minggu'];
        }

        if (stripos($text, 'desain') !== false || stripos($text, 'kreatif') !== false) {
            $roles[] = ['name' => 'Graphic Designer', 'skills' => ['Desain Grafis', 'Branding'], 'time' => '6 jam/minggu'];
        }

        if (stripos($text, 'marketing') !== false || stripos($text, 'promosi') !== false) {
            $roles[] = ['name' => 'Marketing', 'skills' => ['Digital Marketing', 'Content Creation'], 'time' => '10 jam/minggu'];
        }

        return array_slice($roles, 0, 4);
    }

    /**
     * Menghasilkan timeline berdasarkan kompleksitas
     */
    private function generateTimeline($text)
    {
        $complexity = 0;
        $complexityKeywords = ['aplikasi', 'sistem', 'platform', 'website', 'kompleks'];

        foreach ($complexityKeywords as $keyword) {
            if (stripos($text, $keyword) !== false) {
                $complexity++;
            }
        }

        if ($complexity >= 2) {
            return '12 minggu: riset (2 minggu) → desain (3 minggu) → pengembangan (5 minggu) → testing (2 minggu)';
        } elseif ($complexity >= 1) {
            return '8 minggu: riset (1 minggu) → desain (2 minggu) → pengembangan (4 minggu) → testing (1 minggu)';
        } else {
            return '6 minggu: persiapan (1 minggu) → pelaksanaan (4 minggu) → evaluasi (1 minggu)';
        }
    }
}
