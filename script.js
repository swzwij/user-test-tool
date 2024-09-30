// DOM Elements
const featureList = document.getElementById('featureList');
const newFeature = document.getElementById('newFeature');
const addFeature = document.getElementById('addFeature');
const questionList = document.getElementById('questionList');
const newQuestion = document.getElementById('newQuestion');
const addQuestion = document.getElementById('addQuestion');
const toggleModeButton = document.getElementById('toggleMode');
const clearAllButton = document.getElementById('clearAll');
const exportPDFButton = document.getElementById('exportPDF');

// Helper Functions
function createFeatureElement(feature)
{
    const li = document.createElement('li');
    li.innerHTML = 
    `
        <span>${feature}</span>
        <div class="edit-delete-buttons">
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </div>
    `;

    const editButton = li.querySelector('.edit-button');
    const deleteButton = li.querySelector('.delete-button');

    editButton.addEventListener('click', () => editFeature(li));
    deleteButton.addEventListener('click', () => deleteFeature(li));

    return li;
}

function createQuestionElement(question)
{
    const div = document.createElement('div');
    div.className = 'question-item';
    div.innerHTML = 
    `
        <label>${question}</label>
        <textarea rows="3" placeholder="Enter answer here"></textarea>
        <div class="edit-delete-buttons">
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </div>
    `;

    const editButton = div.querySelector('.edit-button');
    const deleteButton = div.querySelector('.delete-button');

    editButton.addEventListener('click', () => editQuestion(div));
    deleteButton.addEventListener('click', () => deleteQuestion(div));

    return div;
}

function editFeature(li)
{
    const span = li.querySelector('span');
    const newText = prompt('Edit feature:', span.textContent);
    if (newText !== null && newText.trim() !== '')
    {
        span.textContent = newText.trim();
        saveData();
    }
}

function deleteFeature(li)
{
    if (confirm('Are you sure you want to delete this feature?'))
    {
        li.remove();
        saveData();
    }
}

function editQuestion(div)
{
    const label = div.querySelector('label');
    const newText = prompt('Edit question:', label.textContent);
    if (newText !== null && newText.trim() !== '')
    {
        label.textContent = newText.trim();
        saveData();
    }
}

function deleteQuestion(div)
{
    if (confirm('Are you sure you want to delete this question?'))
    {
        div.remove();
        saveData();
    }
}

function getElementValue(id)
{
    const element = document.getElementById(id);
    if (element)
    {
        return element.value;
    } 
    else
    {
        console.error(`Element with id '${id}' not found`);
        return '';
    }
}

// Data Management
function loadSavedData()
{
    const savedFeatures = JSON.parse(localStorage.getItem('features') || '[]');
    const savedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');

    savedFeatures.forEach(feature =>
    {
        featureList.appendChild(createFeatureElement(feature));
    });

    savedQuestions.forEach(question =>
    {
        questionList.appendChild(createQuestionElement(question));
    });

    if (localStorage.getItem('darkMode') === 'enabled')
    {
        document.body.classList.add('dark-mode');
    }
}

function saveData()
{
    const features = Array.from(featureList.children).map(li => li.querySelector('span').textContent);
    const questions = Array.from(questionList.children).map(div => div.querySelector('label').textContent);

    localStorage.setItem('features', JSON.stringify(features));
    localStorage.setItem('questions', JSON.stringify(questions));
}

function clearFields()
{
    const fieldsToClean = ['testerName', 'testerAge', 'testerGender', 'testDate', 'testLocation', 'playedBefore', 'preTestNotes', 'realtimeNotes'];
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

// Event Listeners
addFeature.addEventListener('click', () =>
{
    if (newFeature.value.trim() !== '')
    {
        featureList.appendChild(createFeatureElement(newFeature.value.trim()));
        newFeature.value = '';
        saveData();
    }
});

addQuestion.addEventListener('click', () =>
{
    if (newQuestion.value.trim() !== '')
    {
        questionList.appendChild(createQuestionElement(newQuestion.value.trim()));
        newQuestion.value = '';
        saveData();
    }
});

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

clearAllButton.addEventListener('click', () =>
{
    if (confirm('Are you sure you want to clear all fields? This action cannot be undone.')) 
    {
        clearAll();
    }
});

exportPDFButton.addEventListener('click', () =>
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

        function addDivider()
        {
            yPos += 2;
            doc.setDrawColor(200);
            doc.line(10, yPos, 200, yPos);
            yPos += 5;
        }

        addText('User Test Report', 18, true);
        yPos += 5;

        addText('Features Tested:', 14, true);
        featureList.querySelectorAll('li span').forEach(span =>
        {
            addText('- ' + span.textContent, 12, false);
        });
        addDivider();

        addText('Tester Information:', 14, true);
        addText(`Name: ${getElementValue('testerName')}`, 12, false);
        addText(`Age: ${getElementValue('testerAge')}`, 12, false);
        addText(`Gender: ${getElementValue('testerGender')}`, 12, false);
        addText(`Test Date: ${getElementValue('testDate')}`, 12, false);
        addText(`Test Location: ${getElementValue('testLocation')}`, 12, false);
        addText(`Played Before: ${getElementValue('playedBefore')}`, 12, false);
        addDivider();

        addText('Pre-Test Notes:', 14, true);
        const preTestNotes = getElementValue('preTestNotes');
        const splitPreTestNotes = doc.splitTextToSize(preTestNotes, 180);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(splitPreTestNotes, 10, yPos);
        yPos += splitPreTestNotes.length * 7;
        addDivider();

        addText('Test Questions and Answers:', 14, true);
        questionList.querySelectorAll('.question-item').forEach((item, index) =>
        {
            if (index > 0) yPos += 5;
            const question = item.querySelector('label').textContent;
            const answer = item.querySelector('textarea').value;
            addText(question, 12, true);
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const splitAnswer = doc.splitTextToSize(answer, 180);
            doc.text(splitAnswer, 10, yPos);
            yPos += splitAnswer.length * 7;
        });
        addDivider();

        addText('Real-time Notes:', 14, true);
        const realtimeNotes = getElementValue('realtimeNotes');
        const splitNotes = doc.splitTextToSize(realtimeNotes, 180);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(splitNotes, 10, yPos);

        doc.save('user_test_report.pdf');

        clearFields();
    }
    catch (error) 
    {
        console.error('Error generating PDF:', error);
    }
});

window.addEventListener('load', loadSavedData);