from flask import Flask, render_template

app = Flask(__name__)

# Basic route for the homepage
@app.route('/')
def index():
    # This route will display an HTML page named 'index.html'
    return render_template('index.html')

if __name__ == '__main__':
    # Run the Flask development server
    app.run(debug=True)
