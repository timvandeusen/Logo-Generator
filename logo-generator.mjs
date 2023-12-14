import fs from 'fs';
import inquirer from 'inquirer';
import { createCanvas } from 'canvas';

function validateText(value) {
  return value.length <= 3 ? true : 'Please enter up to three characters.';
}

async function getUserInput() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: 'Enter up to three characters for the logo:',
      validate: validateText,
    },
    {
      type: 'input',
      name: 'textColor',
      message: 'Enter text color (keyword or hexadecimal):',
    },
    {
      type: 'list',
      name: 'shape',
      message: 'Select a shape:',
      choices: ['circle', 'square', 'triangle'],
    },
    {
      type: 'input',
      name: 'shapeColor',
      message: 'Enter shape color (keyword or hexadecimal):',
    },
  ]);

  return answers;
}

function generateLogo(options) {
  const canvas = createCanvas(300, 200);
  const context = canvas.getContext('2d');

  // Set background color
  context.fillStyle = options.shapeColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw shape
  switch (options.shape) {
    case 'circle':
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, 2 * Math.PI);
      context.fillStyle = options.textColor;
      context.fill();
      break;
    case 'square':
      context.fillStyle = options.textColor;
      context.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
      break;
    case 'triangle':
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(0, canvas.height);
      context.lineTo(canvas.width, canvas.height);
      context.fillStyle = options.textColor;
      context.fill();
      break;
    default:
      break;
  }

  // Add text
  context.font = '20px Arial';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.fillText(options.text, canvas.width / 2, canvas.height / 2);

  // Save as SVG
  const svgContent = `
    <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${options.shapeColor}"/>
      ${options.shape === 'circle' ? `<circle cx="${canvas.width / 2}" cy="${canvas.height / 2}" r="${canvas.width / 3}" fill="${options.textColor}"/>` : ''}
      ${options.shape === 'square' ? `<rect x="${canvas.width / 4}" y="${canvas.height / 4}" width="${canvas.width / 2}" height="${canvas.height / 2}" fill="${options.textColor}"/>` : ''}
      ${options.shape === 'triangle' ? `<polygon points="${canvas.width / 2},0 0,${canvas.height} ${canvas.width},${canvas.height}" fill="${options.textColor}"/>` : ''}
      <text x="${canvas.width / 2}" y="${canvas.height / 2}" font-size="20" font-family="Arial" fill="black" text-anchor="middle">${options.text}</text>
    </svg>
  `;

  fs.writeFileSync('logo.svg', svgContent);
  console.log('Generated logo.svg');
}

async function run() {
  try {
    const userInput = await getUserInput();
    generateLogo(userInput);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
