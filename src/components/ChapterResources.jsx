// src/components/ChapterResources.jsx
import { useState } from 'react';
import './ChapterResources.css';

function ChapterResources({ chapter }) {
  const [expanded, setExpanded] = useState(false);
  
  // Extract folder or file ID from Google Drive link
  const extractId = (url) => {
    if (!url) return null;
    
    // Regex for folder links
    const folderRegex = /folders\/([a-zA-Z0-9-_]+)/;
    const folderMatch = url.match(folderRegex);
    if (folderMatch) return folderMatch[1];
    
    // Regex for file view links
    const fileRegex = /\/d\/([a-zA-Z0-9-_]+)\//;
    const fileMatch = url.match(fileRegex);
    if (fileMatch) return fileMatch[1];
    
    return null;
  };
  
  // Generate the embedded URL
  const id = extractId(chapter.driveEmbedUrl);
  const embedUrl = id 
    ? `https://drive.google.com/file/d/${id}/preview`
    : null;
  
  return (
    <div className="chapter-resource-card">
      <div 
        className="chapter-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <h3>{chapter.title}</h3>
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
          {expanded ? '−' : '+'}
        </span>
      </div>
      
      {expanded && (
        <div className="chapter-content">
          <p className="chapter-description">{chapter.description}</p>
          
          {embedUrl ? (
            <div className="drive-embed-container">
              <iframe 
                src={embedUrl}
                title={`${chapter.title} Resources`}
                className="drive-embed"
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <div className="error-message">
              No Google Drive link available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChapterResources;