const colors = ['red', 'blue', 'green', 'yellow'];

const allShapes = ['square', 'star', 'ring', 'triangle', 'circle'];

const sequence = [];

const shapeDiv = document.getElementById('shape');
const startBtn = document.getElementById('startBtn');
const questionArea = document.getElementById('questionArea');
const questionText = document.getElementById('question');
const selectionContainer = document.getElementById('selectionContainer');
const submitBtn = document.getElementById('submitBtn');
const resultText = document.getElementById('result');

const sequenceLengthInput = document.getElementById('sequenceLength');
const showTimeInput = document.getElementById('showTime');
const questionCountInput = document.getElementById('questionCount');

let currentShapes = [];
let askedCount = 0;

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateSequence(length) {
    sequence.length = 0;

    const possibleCombinations = [];

    currentShapes.forEach(shape => {
        colors.forEach(color => {
            possibleCombinations.push({
                color,
                shape
            });
        });
    });

    shuffle(possibleCombinations);

    const maxLength = Math.min(length, possibleCombinations.length);

    for (let i = 0; i < maxLength; i++) {
        sequence.push(possibleCombinations[i]);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showShape(item) {
    shapeDiv.className = '';

    if (item.shape === 'triangle') {
        shapeDiv.classList.add('triangle', item.color);
        return;
    }

    shapeDiv.classList.add(item.color, item.shape);
}

async function playSequence(showTime) {
    for (const item of sequence) {
        showShape(item);

        await new Promise(resolve => setTimeout(resolve, showTime));

        shapeDiv.className = '';

    }

    askQuestion();
}

function askQuestion() {
    askedCount = Number(questionCountInput.value);

    questionArea.classList.remove('hidden');

    questionText.innerText = `Mi volt az utolsó ${askedCount} elem?`;

    selectionContainer.innerHTML = '';

    for (let i = 0; i < askedCount; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'selectionRow';

        const colorSelect = document.createElement('select');
        colorSelect.className = 'colorSelect';

        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = translateColor(color);
            colorSelect.appendChild(option);
        });

        const shapeSelect = document.createElement('select');
        shapeSelect.className = 'shapeSelect';

        currentShapes.forEach(shape => {
            const option = document.createElement('option');
            option.value = shape;
            option.textContent = translateShape(shape);
            shapeSelect.appendChild(option);
        });

        wrapper.appendChild(colorSelect);
        wrapper.appendChild(shapeSelect);

        selectionContainer.appendChild(wrapper);
    }
}

submitBtn.addEventListener('click', () => {
    const expected = sequence.slice(-askedCount);

    const rows = document.querySelectorAll('.selectionRow');

    let correct = true;

    rows.forEach((row, index) => {
        const color = row.querySelector('.colorSelect').value;
        const shape = row.querySelector('.shapeSelect').value;

        if (
            color !== expected[index].color ||
            shape !== expected[index].shape
        ) {
            correct = false;
        }
    });

    if (correct) {
        resultText.innerText = 'Helyes válasz!';
        resultText.style.color = 'green';
    } else {
        const correctText = expected
            .map(item => `${translateColor(item.color)} ${translateShape(item.shape)}`)
            .join(', ');

        resultText.innerText = `Helytelen! A helyes válasz: ${correctText}`;
        resultText.style.color = 'red';
    }
});

function translateColor(color) {
    return {
        red: 'Piros',
        blue: 'Kék',
        green: 'Zöld',
        yellow: 'Sárga'
    }[color];
}

function translateShape(shape) {
    return {
        square: 'Négyzet',
        star: 'Csillag',
        ring: 'Gyűrű',
        triangle: 'Háromszög',
        circle: 'Kör'
    }[shape];
}

startBtn.addEventListener('click', async () => {
    currentShapes = Array.from(document.querySelectorAll('.shapeToggle:checked'))
        .map(el => el.value);

    if (currentShapes.length === 0) {
        alert('Válassz legalább egy alakzatot!');
        return;
    }

    let sequenceLength = Number(sequenceLengthInput.value);

    const maxPossible = currentShapes.length * colors.length;

    if (sequenceLength > maxPossible) {
        sequenceLength = maxPossible;
        sequenceLengthInput.value = maxPossible;

        alert(`Maximum ${maxPossible} elem lehetséges a jelenlegi paramétereknek megfelelően.`);
    }
    const showTime = Number(showTimeInput.value);

    startBtn.disabled = true;

    questionArea.classList.add('hidden');
    resultText.innerText = '';

    generateSequence(sequenceLength);

    await playSequence(showTime);

    startBtn.disabled = false;
});
