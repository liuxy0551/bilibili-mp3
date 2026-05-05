#!/bin/bash

echo "Building backend..."
cd backend
npm run build
cd ..

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build complete!"
