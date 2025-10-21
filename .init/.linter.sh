#!/bin/bash
cd /home/kavia/workspace/code-generation/cinema-explorer-178463-178473/movie_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

