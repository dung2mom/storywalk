/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Sparkles, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { STORY_IMAGES } from '../data/storyData';
import { playSoundEffect } from '../utils/audioEngine';

interface CertificateModalProps {
  score: number;
  totalQuestions: number;
  reflectionSentence: string;
  reactionEmoji: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  score,
  totalQuestions,
  reflectionSentence,
  reactionEmoji,
  onClose,
}) => {
  const [studentName, setStudentName] = useState('Super Reader');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Helper to build high-res certificate on canvas (1584 x 1224 - landscape)
  const drawCertificateCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1584;
    canvas.height = 1224;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1224);
    bgGrad.addColorStop(0, '#FFFBEB');
    bgGrad.addColorStop(0.5, '#FFFFFF');
    bgGrad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1584, 1224);

    // Outer double border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#F59E0B';
    ctx.strokeRect(40, 40, 1504, 1144);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D97706';
    ctx.strokeRect(60, 60, 1464, 1104);

    // Corner decorative stars
    const drawStar = (cx: number, cy: number, radius: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = '#F59E0B';
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * radius + cx,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * radius + cy
        );
        ctx.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (radius / 2) + cx,
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * (radius / 2) + cy
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawStar(100, 100, 24);
    drawStar(1484, 100, 24);
    drawStar(100, 1124, 24);
    drawStar(1484, 1124, 24);

    // Official Ribbon Header Pill
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.roundRect(592, 110, 400, 44, 22);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ OFFICIAL READING CERTIFICATE ★', 792, 139);

    // Certificate Title
    ctx.fillStyle = '#451A03';
    ctx.font = 'bold 64px system-ui, "Fredoka", cursive, sans-serif';
    ctx.fillText('StoryWalk! Explorer Award', 792, 230);

    // "Awarded to"
    ctx.fillStyle = '#6B7280';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('This certificate is proudly awarded to:', 792, 290);

    // Student Name
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 56px system-ui, "Fredoka", sans-serif';
    const displayName = studentName.trim() || 'Super Reader';
    ctx.fillText(displayName, 792, 380);

    // Underline beneath name
    const textWidth = ctx.measureText(displayName).width;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(792 - textWidth / 2 - 20, 400);
    ctx.lineTo(792 + textWidth / 2 + 20, 400);
    ctx.stroke();

    // Achievement text
    ctx.fillStyle = '#374151';
    ctx.font = '26px system-ui, sans-serif';
    ctx.fillText('For successfully listening, understanding, and completing all 10 pages of:', 792, 470);

    // Story Title
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 44px system-ui, "Fredoka", sans-serif';
    ctx.fillText('"The Lost Hat" 👒', 792, 535);

    // Stats Box
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(240, 590, 1104, 210, 24);
    ctx.fill();
    ctx.stroke();

    // Stats Grid
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Quiz Score:', 280, 650);
    ctx.fillStyle = '#059669';
    ctx.fillText(`${score} / ${totalQuestions} Correct (100% Complete!) ⭐`, 460, 650);

    ctx.fillStyle = '#1F2937';
    ctx.fillText('Reader Feeling:', 280, 700);
    ctx.fillStyle = '#78350F';
    ctx.fillText(`${reactionEmoji} Great Story Experience`, 480, 700);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText("Reader's Reflection:", 280, 750);
    ctx.font = 'italic 22px system-ui, sans-serif';
    ctx.fillStyle = '#374151';
    const quote = `"${reflectionSentence}"`;
    ctx.fillText(quote.length > 70 ? quote.slice(0, 70) + '...' : quote, 500, 750);

    // Footer Info
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(`Target Level: CEFR Pre-A1 · Elementary Grade 3–4`, 440, 890);
    ctx.fillText(`Award Date: ${new Date().toLocaleDateString()}`, 1144, 890);

    // Golden Medal Seal on Canvas
    ctx.save();
    ctx.translate(792, 1000);
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ 100% ★', 0, -6);
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('VERIFIED', 0, 18);
    ctx.restore();

    return canvas;
  };

  // Convert canvas to a standard PDF 1.4 file
  const generatePdfBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        async (jpegBlob) => {
          if (!jpegBlob) {
            reject(new Error('Failed to generate JPEG blob'));
            return;
          }

          const arrayBuffer = await jpegBlob.arrayBuffer();
          const jpegBytes = new Uint8Array(arrayBuffer);
          const width = canvas.width;
          const height = canvas.height;

          // Standard US Letter Landscape MediaBox [0 0 792 612]
          const contentStream = 'q\n792 0 0 612 0 0 cm\n/Im1 Do\nQ\n';
          const contentLen = contentStream.length;

          const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
          const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
          const obj3 =
            '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
          const obj4Header = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
          const obj4Footer = '\nendstream\nendobj\n';
          const obj5 = `5 0 obj\n<< /Length ${contentLen} >>\nstream\n${contentStream}endstream\nendobj\n`;

          const header = '%PDF-1.4\n';
          const enc = new TextEncoder();
          let pos = enc.encode(header).length;
          const xref: number[] = [0];

          xref.push(pos);
          pos += enc.encode(obj1).length;

          xref.push(pos);
          pos += enc.encode(obj2).length;

          xref.push(pos);
          pos += enc.encode(obj3).length;

          xref.push(pos);
          const obj4HeaderBytes = enc.encode(obj4Header);
          const obj4FooterBytes = enc.encode(obj4Footer);
          pos += obj4HeaderBytes.length + jpegBytes.length + obj4FooterBytes.length;

          xref.push(pos);
          pos += enc.encode(obj5).length;

          const xrefOffset = pos;
          let xrefStr = 'xref\n0 6\n0000000000 65535 f \n';
          for (let i = 1; i <= 5; i++) {
            xrefStr += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
          }
          const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

          const pdfBlob = new Blob(
            [
              enc.encode(header),
              enc.encode(obj1),
              enc.encode(obj2),
              enc.encode(obj3),
              obj4HeaderBytes,
              jpegBytes,
              obj4FooterBytes,
              enc.encode(obj5),
              enc.encode(xrefStr),
              enc.encode(trailer),
            ],
            { type: 'application/pdf' }
          );

          resolve(pdfBlob);
        },
        'image/jpeg',
        0.92
      );
    });
  };

  // Download PDF Handler
  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      playSoundEffect('pop');
      const canvas = await drawCertificateCanvas();
      const pdfBlob = await generatePdfBlob(canvas);

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `StoryWalk_Certificate_${studentName.replace(/[^a-zA-Z0-9]/g, '_') || 'Reader'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playSoundEffect('fanfare');
      setDownloadSuccess('PDF Certificate downloaded successfully! 📄');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Image Handler (PNG)
  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      playSoundEffect('pop');
      const canvas = await drawCertificateCanvas();
      const url = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = url;
      a.download = `StoryWalk_Certificate_${studentName.replace(/[^a-zA-Z0-9]/g, '_') || 'Reader'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      playSoundEffect('chime');
      setDownloadSuccess('Image Certificate saved successfully! 🖼️');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-300 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            playSoundEffect('pop');
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center min-w-[44px] min-h-[44px] transition-colors"
          aria-label="Close certificate"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Preview */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-3 border-amber-300 text-center relative shadow-sm">
          {/* Badge Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 bg-amber-100">
            <img
              src={STORY_IMAGES.badge}
              alt="Story Explorer Badge"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-black uppercase tracking-widest font-display mt-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Official Reading Certificate
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-display mt-2 tracking-tight">
            StoryWalk! Explorer Award
          </h2>

          <p className="text-xs text-slate-500 font-semibold mt-1">
            This certificate is proudly awarded to:
          </p>

          {/* Student Name Input */}
          <div className="my-2.5">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="text-center text-xl sm:text-2xl font-black text-amber-900 border-b-2 border-amber-400 bg-amber-50/50 hover:bg-amber-50 focus:bg-white focus:outline-hidden focus:border-amber-600 px-3 py-1.5 rounded-t-lg max-w-[280px] font-display transition-colors"
              placeholder="Enter student name"
              title="Click to type your name"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium px-2">
            For successfully listening, reading, and completing all 10 pages of:
          </p>

          <p className="text-lg font-black text-amber-950 font-display mt-1">
            "The Lost Hat" 👒
          </p>

          {/* Score & Reflection Summary */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-white border border-amber-200 text-xs sm:text-sm text-slate-700 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between font-bold">
              <span>Quiz Score:</span>
              <span className="text-emerald-700 font-black">{score} / {totalQuestions} Correct</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span>Reaction:</span>
              <span>{reactionEmoji} Completed with joy!</span>
            </div>
            <div className="pt-2 border-t border-slate-100 text-left">
              <span className="font-extrabold text-amber-900 block text-xs">Reader's Reflection:</span>
              <span className="italic text-slate-800 font-medium text-xs sm:text-sm">"{reflectionSentence}"</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-bold text-slate-400 flex items-center justify-between px-2">
            <span>Level: CEFR Pre-A1 · Grade 3–4</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Action: PDF Download Only (Print button removed) */}
        <div className="mt-4">
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-base font-display flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 transition-all active:scale-98 min-h-[52px]"
          >
            <FileText className="w-5 h-5" />
            <span>{isGenerating ? 'Generating PDF...' : 'Download Certificate (PDF)'}</span>
          </button>
        </div>

        {/* Secondary: Save as Image & Done */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
            <span>Save as Image (PNG)</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('pop');
              onClose();
            }}
            className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors min-h-[40px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
