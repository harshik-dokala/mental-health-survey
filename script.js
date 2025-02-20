// Mental Health Survey - Starter Template

// 1. Supabase Setup
const SUPABASE_URL = 'https://mivjupgyhsfeuvzcorct.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdmp1cGd5aHNmZXV2emNvcmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzczOTgsImV4cCI6MjA1NTY1MzM5OH0.dP5Psa4zu41h41Z-ouvyn1tQ1RnKkglxzUqM8TCIkUs';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// 2. Survey Questions
const questions = [
    {
        question: "How would you rate your overall mood lately?",
        options: ["Very Positive", "Somewhat Positive", "Neutral", "Somewhat Negative", "Very Negative"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you feel energized and motivated during the day?",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How well do you handle unexpected challenges?",
        options: ["Very Well", "Fairly Well", "Okay", "Not Well", "Poorly"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you feel overwhelmed by your responsibilities?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How connected do you feel to the people around you?",
        options: ["Very Connected", "Somewhat Connected", "Neutral", "Somewhat Disconnected", "Very Disconnected"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you take time for activities you enjoy?",
        options: ["Daily", "A Few Times a Week", "Once a Week", "Rarely", "Never"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How would you rate your ability to relax when stressed?",
        options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you feel hopeful about the future?",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How comfortable are you asking for help when you need it?",
        options: ["Very Comfortable", "Somewhat Comfortable", "Neutral", "Somewhat Uncomfortable", "Very Uncomfortable"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you feel in control of your emotions?",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How would you rate your sleep quality?",
        options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you feel anxious or worried?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How confident are you in pursuing your goals?",
        options: ["Very Confident", "Somewhat Confident", "Neutral", "Somewhat Doubtful", "Not Confident"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How often do you feel proud of your accomplishments?",
        options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
        values: [5, 4, 3, 2, 1]
    },
    {
        question: "How do you feel about your current work/study-life balance?",
        options: ["Very Satisfied", "Somewhat Satisfied", "Neutral", "Somewhat Dissatisfied", "Very Dissatisfied"],
        values: [5, 4, 3, 2, 1]
    }
];

// 3. Render Survey
function renderSurvey() {
    const form = document.getElementById("survey-form");
    form.innerHTML = "";
    questions.forEach((q, index) => {
        let questionBlock = `<div class='question'><p>${q.question}</p>`;
        q.options.forEach((option, i) => {
            questionBlock += `<label><input type='radio' name='q${index}' value='${q.values[i]}' required> ${option}</label>`;
        });
        questionBlock += "</div>";
        form.innerHTML += questionBlock;
    });
    form.innerHTML += `<button type='submit'>Submit</button>`;
}

document.addEventListener("DOMContentLoaded", renderSurvey);

// 4. Handle Form Submission
async function submitSurvey(event) {
    event.preventDefault();
    let responses = {};
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name='q${index}']:checked`);
        if (selected) {
            responses[`q${index}`] = parseInt(selected.value);
        }
    });
    
    const { data, error } = await supabase.from("survey_responses").insert([responses]);
    if (error) {
        console.error("Error submitting survey:", error);
    } else {
        alert("Survey submitted successfully!");
        visualizeResults();
    }
}

document.getElementById("survey-form").addEventListener("submit", submitSurvey);

// 5. Visualize Results
async function visualizeResults() {
    const { data, error } = await supabase.from("survey_responses").select("*");
    if (error) {
        console.error("Error fetching results:", error);
        return;
    }
    
    let averages = Array(questions.length).fill(0);
    data.forEach(response => {
        questions.forEach((_, index) => {
            averages[index] += response[`q${index}`];
        });
    });
    averages = averages.map(sum => sum / data.length);

    // Render Chart.js
    const ctx = document.getElementById("resultsChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: questions.map(q => q.question),
            datasets: [{
                label: "Average Score",
                data: averages,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 5 }
            }
        }
    });
}

// HTML & CSS (Add in your HTML file)
// <canvas id="resultsChart"></canvas>
// <form id="survey-form"></form>

// Include Chart.js in your HTML file: 
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
