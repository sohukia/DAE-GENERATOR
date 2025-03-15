echo "Installing DAE-GENERATOR...";
git clone https://github.com/sohukia/DAE-GENERATOR.git DAE-GENERATOR;

echo "Installing dependencies...";
cd DAE-GENERATOR;
npm install;

echo "DAE-GENERATOR installed successfully!";
echo "Run 'npm start' to start the server.";
echo "Open 'http://localhost:3000' in your browser to access the application.";
echo "For more information, visit 'https://github.com/sohukia/DAE-GENERATOR'.";
echo "Thank you!";