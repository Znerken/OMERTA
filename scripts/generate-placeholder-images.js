const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const origins = ['little-italy', 'docks', 'downtown', 'outskirts'];
const classes = ['enforcer', 'consigliere', 'racketeer', 'shadow', 'street-boss'];
const traits = ['connected', 'street-smart', 'old-money', 'quick-learner', 'iron-will', 'silver-tongue'];

function generatePlaceholderImage(text, outputPath) {
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 400, 300);

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 200, 150);

    // Save image
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(outputPath, buffer);
}

// Create directories if they don't exist
const dirs = ['public/images/origins', 'public/images/classes', 'public/images/traits'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Generate origin images
origins.forEach(origin => {
    generatePlaceholderImage(
        origin.replace(/-/g, ' ').toUpperCase(),
        path.join('public/images/origins', `${origin}.jpg`)
    );
});

// Generate class images
classes.forEach(characterClass => {
    generatePlaceholderImage(
        characterClass.replace(/-/g, ' ').toUpperCase(),
        path.join('public/images/classes', `${characterClass}.jpg`)
    );
});

// Generate trait images
traits.forEach(trait => {
    generatePlaceholderImage(
        trait.replace(/-/g, ' ').toUpperCase(),
        path.join('public/images/traits', `${trait}.jpg`)
    );
});

console.log('Placeholder images generated successfully!'); 