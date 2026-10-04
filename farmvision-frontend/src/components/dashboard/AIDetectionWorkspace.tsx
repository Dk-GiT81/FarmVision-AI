import React from 'react';
import { User, PredictionResult as PredictionResultType } from '../../types';
import Upload from '../upload/Upload';
import PredictionResult from '../upload/PredictionResult';
import { Sparkles, Scan } from 'lucide-react';

interface AIDetectionWorkspaceProps {
  user: User;
  predictionResult: PredictionResultType | null;
  predictionLoading: boolean;
  setPredictionResult: (result: PredictionResultType | null) => void;
  setPredictionLoading: (loading: boolean) => void;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export const AIDetectionWorkspace: React.FC<AIDetectionWorkspaceProps> = ({
  user,
  predictionResult,
  predictionLoading,
  setPredictionResult,
  setPredictionLoading,
  setRefreshTrigger,
}) => {
  return (
    <div className="ai-workspace-container">
      {/* 1. DEDICATED WORKSPACE HEADER */}
      <div className="workspace-header-card glass-panel">
        <div className="workspace-header-content">
          <div className="workspace-header-badge">
            <Sparkles size={13} className="text-purple" />
            <span>AI-Powered Detection</span>
          </div>

          <h1 className="workspace-title">
            <Scan size={26} className="text-purple" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }} />
            <span>AI Disease Detection</span>
          </h1>

          <p className="workspace-subtitle">
            Upload a pomegranate image and let FarmVision AI analyze it for potential diseases.
          </p>
        </div>

        <div className="workspace-header-info">
          <div className="supported-crops-pill">
            <span className="live-dot" />
            <span>Punica Granatum • 5 Disease Classes</span>
          </div>
        </div>
      </div>

      {/* 2. BALANCED TWO-COLUMN WORKSPACE GRID */}
      <div className="ai-workspace-grid">
        <div className="workspace-upload-column">
          <Upload
            user={user}
            setRefreshTrigger={setRefreshTrigger}
            onPredictionResult={setPredictionResult}
            onLoadingChange={setPredictionLoading}
          />
        </div>

        <div className="workspace-result-column">
          <PredictionResult
            result={predictionResult}
            loading={predictionLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AIDetectionWorkspace;
