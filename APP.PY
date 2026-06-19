from flask import Flask, render_template, request
from textblob import TextBlob
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

nltk.download('punkt')
nltk.download('stopwords')


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    sentiment = ""
    cleaned_text = ""

    if request.method == 'POST':
        text = request.form['text']

        # Tokenization
        tokens = text.split()

        # Remove stop words
        stop_words = set(stopwords.words('english'))
        filtered = [word for word in tokens if word.lower() not in stop_words]

        cleaned_text = " ".join(filtered)

        # Sentiment Analysis
        polarity = TextBlob(cleaned_text).sentiment.polarity

        if polarity > 0:
            sentiment = "Positive"
        elif polarity < 0:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

    return render_template(
        'index.html',
        sentiment=sentiment,
        cleaned_text=cleaned_text
    )

if __name__ == '__main__':
    app.run(debug=True)