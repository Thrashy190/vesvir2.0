import React, { useEffect, useRef } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';

function Babylon({ graphicsEngine, renderCanvasRef }) {
  const canvasRef = useRef(null);

  const models = [
    {
      url: './assets/',
      fileName: 'camisaG.glb',
      thumbnailUrl: '/assets/shirt.jpeg',
    },
    {
      url: './assets/',
      fileName: 'Camisa.glb',
      thumbnailUrl: '/assets/greenShirt.jpeg',
    },
    {
      url: './assets/',
      fileName: 'camisaG.glb',
      thumbnailUrl: '/assets/shirt.jpeg',
    },
    {
      url: './assets/',
      fileName: 'Camisa.glb',
      thumbnailUrl: '/assets/greenShirt.jpeg',
    },
  ];

  const importMesh = (url, fileName) => {
    console.log(`button clicked, importing ${fileName} from ${url}`);
    graphicsEngine.current.importMesh(url, fileName);
  };

  useEffect(() => {
    renderCanvasRef.current = canvasRef.current;
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="RenderCanvas"
        style={{ width: 640, height: 480 }}
      />
      <div className="UI-Buttons">
        <Button
          style={{ borderRadius: '50px' }}
          variant="contained"
          size="small"
        >
          <ArrowBack />
        </Button>
        {models.map((model, id) => {
          return (
            <Button
              key={id}
              style={{
                borderRadius: '50px',
                backgroundImage: `url(${model.thumbnailUrl})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
              variant="outlined"
              size="small"
              onClick={() => importMesh(model.url, model.fileName)}
            />
          );
        })}
        <Button
          style={{ borderRadius: '50px' }}
          variant="contained"
          size="small"
        >
          <ArrowForward />
        </Button>
      </div>
    </>
  );
}

export default Babylon;
