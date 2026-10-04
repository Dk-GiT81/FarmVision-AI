import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, X, AlertCircle, Loader2, FileCheck, RefreshCw } from 'lucide-react';
import { PredictionResult as PredictionResultType, User } from '../../types';
import { predictDisease } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

interface UploadProps {
  user: User;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
  onPredictionResult: (result: PredictionResultType | null) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const Upload: React.FC<UploadProps> = ({
  user,
  setRefreshTrigger,
  onPredictionResult,
  onLoadingChange,
}) => {
  const { success, error: notifyError, warning } = useNotification();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        const msg = 'Please upload a valid pomegranate image file (JPG, PNG, WEBP).';
        setErrorMessage(msg);
        warning(msg);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        const msg = 'Image exceeds 10MB limit. Please upload a smaller image file.';
        setErrorMessage(msg);
        warning(msg);
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('image/')) {
        const msg = 'Please upload a valid image file (JPG, PNG, WEBP).';
        setErrorMessage(msg);
        warning(msg);
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        const msg = 'Image exceeds 10MB limit. Please upload a smaller image file.';
        setErrorMessage(msg);
        warning(msg);
        return;
      }
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      const msg = 'Please select a pomegranate image to analyze.';
      setErrorMessage(msg);
      warning(msg);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    if (onLoadingChange) onLoadingChange(true);

    try {
      const data = await predictDisease(file, user.email);

      if (data.error) {
        const msg = "We couldn't analyze this image. Please try again.";
        setErrorMessage(msg);
        notifyError(msg);
      } else {
        onPredictionResult(data);
        setRefreshTrigger((prev) => prev + 1);
        success('Prediction completed successfully.');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      const msg = "Unable to analyze the image right now. Please try again.";
      setErrorMessage(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  return (
    <div className="glass-panel upload-panel">
      <div className="card-title-row">
        <h3>
          <UploadCloud size={20} className="text-purple" />
          <span>Upload Image</span>
        </h3>
        <span className="badge badge-purple">AI Powered</span>
      </div>

      <p className="card-subtitle">
        Upload or capture a pomegranate fruit or leaf image to run instant deep learning disease classification.
      </p>

      {errorMessage && (
        <div className="alert-message alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* DRAG & DROP ZONE */}
      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload pomegranate image area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="file-input-hidden"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {preview && file ? (
          <div className="preview-container">
            <div className="preview-image-wrapper">
              <img src={preview} alt="Pomegranate preview" className="preview-image" />
              <button
                type="button"
                className="preview-remove-btn"
                onClick={handleClear}
                title="Remove image"
                aria-label="Remove uploaded image"
              >
                <X size={16} />
              </button>
            </div>

            {/* FILE METADATA STRIP */}
            <div className="preview-meta-card">
              <div className="preview-meta-left">
                <FileCheck size={18} className="text-healthy" />
                <div className="preview-file-details">
                  <span className="preview-filename">{file.name}</span>
                  <span className="preview-filesize">{formatFileSize(file.size)} • Ready for analysis</span>
                </div>
              </div>
              <div className="preview-actions">
                <button
                  type="button"
                  className="btn btn-glass btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  <RefreshCw size={13} />
                  <span>Change</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleClear}
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                  title="Remove image"
                >
                  <X size={13} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="drop-zone-prompt">
            <div className="drop-icon-wrapper">
              <UploadCloud size={32} />
            </div>
            <p className="drop-main-text">
              Drag &amp; drop your pomegranate image here, or
            </p>
            <div className="drop-browse-action" style={{ margin: '10px 0' }}>
              <button
                type="button"
                className="btn btn-primary browse-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <UploadCloud size={16} />
                <span>Upload / Browse Image</span>
              </button>
            </div>
            <p className="drop-sub-text">Supported formats: PNG, JPG, JPEG, WEBP (up to 10MB)</p>
          </div>
        )}
      </div>

      {/* ANALYZE / PREDICT BUTTON */}
      <div style={{ marginTop: '20px' }}>
        <button
          type="button"
          className="btn btn-primary btn-full analyze-cta-btn"
          disabled={!file || loading}
          onClick={handleUpload}
          style={{ height: '48px', fontSize: '15px' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing Image with AI...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Analyze Disease</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Upload;
