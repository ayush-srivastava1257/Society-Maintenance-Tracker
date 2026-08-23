import React, { useState } from 'react';
import { X, Upload, AlertCircle, Wrench } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface RaiseComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'Security', 'Maintenance', 'Other'];
const PRIORITIES = [
  { value: 'LOW', label: 'LOW (Minor)' },
  { value: 'MEDIUM', label: 'MEDIUM (Normal)' },
  { value: 'HIGH', label: 'HIGH (Urgent)' },
];

export const RaiseComplaintModal: React.FC<RaiseComplaintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and description.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('priority', priority);
      formData.append('description', description.trim());
      if (file) {
        formData.append('photo', file);
      }

      await api.createComplaint(formData);
      showToast('success', 'Complaint reported successfully!');

      setTitle('');
      setCategory('Plumbing');
      setPriority('MEDIUM');
      setDescription('');
      setFile(null);
      setPreviewUrl(null);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-page-enter">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A7B1B5] hover:text-[#E9E3D2] p-1.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D38]/20 border border-[#E88D38]/40 flex items-center justify-center text-[#E88D38]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#E9E3D2]">Report Maintenance Issue</h2>
            <p className="text-xs text-[#A7B1B5]">Direct notification to facility administration</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-[#C96A6A]/15 border border-[#C96A6A]/40 rounded-xl flex items-center space-x-2.5 text-[#C96A6A] text-xs font-semibold mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              COMPLAINT TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water Leakage in Balcony Pipe"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
                PRIORITY
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, location details, and urgency..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E88D38]/25 bg-[#121E2C] text-[#F3F0E8] focus:outline-none focus:border-[#E88D38] text-xs font-medium resize-none"
              required
            />
          </div>

          {/* Photo Evidence Upload */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#E9E3D2] uppercase tracking-wider mb-1">
              ATTACH PHOTO EVIDENCE (OPTIONAL)
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 border border-dashed border-[#E88D38]/40 hover:border-[#E88D38] bg-[#121E2C] rounded-xl p-3 text-center cursor-pointer transition-colors group">
                <Upload className="w-4 h-4 text-[#E88D38] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#E9E3D2] block">
                  {file ? file.name : 'Upload Photo Evidence'}
                </span>
                <span className="text-[10px] text-[#A7B1B5]">JPG, PNG or WEBP (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {previewUrl && (
                <div className="w-16 h-16 rounded-xl border border-[#E88D38]/40 overflow-hidden shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E88D38]/30 text-xs font-bold text-[#A7B1B5] hover:text-[#E9E3D2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-[#E88D38] hover:bg-[#F09B48] text-[#0D1A28] font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Request →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
