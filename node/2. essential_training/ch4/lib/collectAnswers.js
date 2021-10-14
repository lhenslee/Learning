const readline = require('readline');
const {eventEmitter} = require('events');
const { EventEmitter } = require('stream');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

module.exports = (questions, done = f => f) => {
    const answers = [];
    const [firstQuestion] = questions;
    const emitter = new EventEmitter();
    // done(answers)

    const questionAnswered = answer => {
        emitter.emit("answer", answer);
        answers.push(answer);
        if (answers.length < questions.length) {
            rl.question(questions[answers.length], questionAnswered);
        } else {
            emitter.emit("complete", answers);
            done(answers)
        }
    };

    rl.question(firstQuestion, questionAnswered);
    return emitter;
}
