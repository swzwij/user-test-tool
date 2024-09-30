function loadSavedData() 
{
    const savedFeatures = JSON.parse(localStorage.getItem('features') || '[]');
    const savedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');

    savedFeatures.forEach(feature => 
    {
        const li = document.createElement('li');
        li.textContent = feature;
        featureList.appendChild(li);
    });

    savedQuestions.forEach(question => 
    {
        const div = document.createElement('div');
        div.innerHTML = 
        `
            <label>${question}</label>
            <textarea rows="3"></textarea>
        `;
        questionList.appendChild(div);
    });

    if (localStorage.getItem('darkMode') === 'enabled') 
    {
        document.body.classList.add('dark-mode');
    }
}

function saveData() 
{
    const features = Array.from(featureList.children).map(li => li.textContent);
    const questions = Array.from(questionList.children).map(div => div.querySelector('label').textContent);
    
    localStorage.setItem('features', JSON.stringify(features));
    localStorage.setItem('questions', JSON.stringify(questions));
}

const featureList = document.getElementById('featureList');
const newFeature = document.getElementById('newFeature');
const addFeature = document.getElementById('addFeature');

addFeature.addEventListener('click', () => 
{
    if (newFeature.value.trim() !== '') 
    {
        const li = document.createElement('li');
        li.textContent = newFeature.value;
        featureList.appendChild(li);
        newFeature.value = '';
        saveData();
    }
});

const questionList = document.getElementById('questionList');
const newQuestion = document.getElementById('newQuestion');
const addQuestion = document.getElementById('addQuestion');

addQuestion.addEventListener('click', () => 
{
    if (newQuestion.value.trim() !== '') 
    {
        const div = document.createElement('div');
        div.innerHTML = 
        `
            <label>${newQuestion.value}</label>
            <textarea rows="3"></textarea>
        `;
        questionList.appendChild(div);
        newQuestion.value = '';
        saveData();
    }
});

function getElementValue(id) 
{
    const element = document.getElementById(id);
    if (element) {
        return element.value;
    } else {
        console.error(`Element with id '${id}' not found`);
        return '';
    }
}

document.getElementById('exportPDF').addEventListener('click', () => 
{
    try 
    {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPos = 10;

        function addText(text, fontSize = 12, isBold = false) 
        {
            doc.setFontSize(fontSize);
            doc.setFont(undefined, isBold ? 'bold' : 'normal');
            doc.text(text, 10, yPos);
            yPos += fontSize / 2 + 2;
        }

        addText('User Test Report', 18, true);
        yPos += 10;

        addText('Features Tested:', 14, true);
        featureList.querySelectorAll('li').forEach(li => {
            addText('- ' + li.textContent);
        });
        yPos += 5;

        addText('Tester Information:', 14, true);
        addText(`Name: ${getElementValue('testerName')}`);
        addText(`Age: ${getElementValue('testerAge')}`);
        addText(`Gender: ${getElementValue('testerGender')}`);
        addText(`Test Date: ${getElementValue('testDate')}`);
        addText(`Test Location: ${getElementValue('testLocation')}`);
        addText(`Played Before: ${getElementValue('playedBefore')}`);
        yPos += 5;

        addText('Test Questions and Answers:', 14, true);
        questionList.querySelectorAll('div').forEach(div => 
        {
            addText(div.querySelector('label').textContent, 12, true);
            addText(div.querySelector('textarea').value);
            yPos += 2;
        });
        yPos += 5;

        addText('Real-time Notes:', 14, true);
        const realtimeNotes = getElementValue('realtimeNotes');
        const splitNotes = doc.splitTextToSize(realtimeNotes, 180);
        doc.text(splitNotes, 10, yPos);

        doc.save('user_test_report.pdf');

        clearFields();
    } 
    catch (error) 
    {
        console.error('Error generating PDF:', error);
    }
});

function clearFields() 
{
    const fieldsToClean = ['testerName', 'testerAge', 'testerGender', 'testDate', 'testLocation', 'playedBefore', 'realtimeNotes'];
    fieldsToClean.forEach(fieldId => 
    {
        const field = document.getElementById(fieldId);
        if (field) 
        {
            field.value = '';
        } 
        else 
        {
            console.error(`Field with id '${fieldId}' not found`);
        }
    });

    questionList.querySelectorAll('textarea').forEach(textarea => 
    {
        textarea.value = '';
    });
}

function clearAll() 
{
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => 
    {
        input.value = '';
    });

    featureList.innerHTML = '';
    questionList.innerHTML = '';

    localStorage.removeItem('features');
    localStorage.removeItem('questions');
}

document.getElementById('clearAll').addEventListener('click', () => 
{
    if (confirm('Are you sure you want to clear all fields? This action cannot be undone.')) 
    {
        clearAll();
    }
});

const toggleModeButton = document.getElementById('toggleMode');
toggleModeButton.addEventListener('click', () => 
{
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) 
    {
        localStorage.setItem('darkMode', 'enabled');
    } 
    else 
    {
        localStorage.setItem('darkMode', 'disabled');
    }
});

window.addEventListener('load', loadSavedData);