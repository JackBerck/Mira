<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReportNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Report $report
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $reportableType = class_basename($this->report->reportable_type);
        $reporterName = $this->report->user->name;

        return (new MailMessage)
            ->subject("🚨 Laporan Baru: {$reportableType}")
            ->greeting("Halo Admin,")
            ->line("Sebuah laporan baru telah diterima dari {$reporterName}.")
            ->line("**Tipe Konten:** {$reportableType}")
            ->line("**Alasan:** {$this->getReasonLabel($this->report->reason)}")
            ->line("**Pesan:**")
            ->line($this->report->message)
            ->action('Tinjau Laporan', url("/admin/reports/{$this->report->id}"))
            ->line('Mohon tinjau dan ambil tindakan yang diperlukan.')
            ->salutation('Terima kasih, ' . config('app.name'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'reporter_id' => $this->report->user_id,
            'reporter_name' => $this->report->user->name,
            'reportable_type' => class_basename($this->report->reportable_type),
            'reportable_id' => $this->report->reportable_id,
            'reason' => $this->report->reason,
            'message' => $this->report->message,
            'created_at' => $this->report->created_at->toISOString(),
        ];
    }

    private function getReasonLabel(string $reason): string
    {
        return match($reason) {
            'spam' => 'Spam',
            'inappropriate' => 'Konten Tidak Pantas',
            'harassment' => 'Pelecehan',
            'misinformation' => 'Informasi Salah',
            'copyright' => 'Pelanggaran Hak Cipta',
            'other' => 'Lainnya',
            default => $reason,
        };
    }
}
