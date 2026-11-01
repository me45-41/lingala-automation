# Fine-tuning Models for LingalaAutomation

This guide explains how to fine-tune AI models to specialize in LingalaAutomation code generation.

---

## 🎯 Why Fine-tuning?

Fine-tuning allows models to:
- Learn LingalaAutomation syntax deeply
- Generate more accurate code
- Understand the hybrid syntax model
- Provide better suggestions
- Reduce hallucinations

---

## 📋 Prerequisites

### 1. Dataset Preparation

Collect a large dataset of LingalaAutomation code:

```bash
# Create dataset structure
lingala-automation-dataset/
├── train/
│   ├── basics/
│   ├── advanced/
│   ├── security/
│   └── web/
├── validation/
└── test/
```

### 2. Data Format

Format your dataset in JSONL format for fine-tuning:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are an expert in LingalaAutomation programming language."
    },
    {
      "role": "user",
      "content": "Create a function to calculate factorial"
    },
    {
      "role": "assistant",
      "content": "mosala factorielle(n) banda\n  soki n <= 1 banda\n    zonga 1;\n  }\n  zonga n * factorielle(n - 1);\n}"
    }
  ]
}
```

---

## 🚀 Fine-tuning Options

### Option 1: OpenAI Fine-tuning

**Cost:** ~$0.008 per 1K tokens  
**Best for:** High quality, production use

**Steps:**

1. **Prepare dataset:**
```bash
# Convert examples to JSONL format
python prepare_dataset.py
```

2. **Upload to OpenAI:**
```python
import openai

client = openai.OpenAI(api_key="YOUR_API_KEY")

# Upload dataset
dataset_file = client.files.create(
  file=open("lingala-dataset.jsonl", "rb"),
  purpose="fine-tune"
)

# Create fine-tuning job
job = client.fine_tuning.jobs.create(
  training_file=dataset_file.id,
  model="gpt-3.5-turbo",
  hyperparameters={
    "n_epochs": 3,
    "batch_size": 1,
    "learning_rate_multiplier": 0.1
  }
)
```

3. **Monitor job:**
```python
job = client.fine_tuning.jobs.retrieve(job.id)
print(f"Status: {job.status}")
```

4. **Use fine-tuned model:**
```python
response = client.chat.completions.create(
  model=job.fine_tuned_model,
  messages=[
    {"role": "user", "content": "Generate a function in LingalaAutomation"}
  ]
)
```

### Option 2: OpenRouter with Custom Models

**Cost:** Variable (depends on model)  
**Best for:** Flexibility, multiple model options

**Steps:**

1. **Fine-tune open-source model (Llama, Mistral):**
```bash
# Using Hugging Face transformers
python fine_tune_llama.py \
  --model meta-llama/Llama-2-7b \
  --dataset lingala-dataset \
  --output lingala-llama-7b
```

2. **Deploy to OpenRouter:**
   - Contact OpenRouter support
   - Submit your fine-tuned model
   - Get API endpoint

3. **Use via OpenRouter:**
```javascript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "your-custom-lingala-model",
    messages: [
      { role: "user", content: "Generate LingalaAutomation code" }
    ]
  })
});
```

### Option 3: Local Fine-tuning with Ollama

**Cost:** Free (but requires GPU)  
**Best for:** Development, testing

**Steps:**

1. **Install Ollama:**
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com
```

2. **Prepare Modelfile:**
```dockerfile
FROM llama2

PARAMETER temperature 0.7
PARAMETER top_p 0.9

SYSTEM You are an expert in LingalaAutomation programming language.

# Load training data
COPY lingala-dataset.jsonl /data
```

3. **Create custom model:**
```bash
ollama create lingala-automation -f Modelfile
```

4. **Use the model:**
```bash
ollama run lingala-automation "Generate a function in LingalaAutomation"
```

---

## 📊 Dataset Preparation Script

### Python Script to Prepare Dataset

```python
import json
import os
from pathlib import Path

def prepare_dataset(input_dir, output_file):
    """
    Convert LingalaAutomation examples to JSONL format for fine-tuning
    """
    examples = []
    
    # Read all .lingala files
    for file_path in Path(input_dir).rglob("*.lingala"):
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
            
        # Create training example
        example = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert in LingalaAutomation programming language. Use proper syntax: tanga for variables, mosala for functions, soki for conditionals, kanda for loops."
                },
                {
                    "role": "user",
                    "content": f"Generate or explain this LingalaAutomation code:\n{code}"
                },
                {
                    "role": "assistant",
                    "content": code
                }
            ]
        }
        examples.append(example)
    
    # Write to JSONL
    with open(output_file, 'w', encoding='utf-8') as f:
        for example in examples:
            f.write(json.dumps(example) + '\n')
    
    print(f"Prepared {len(examples)} examples in {output_file}")

# Usage
prepare_dataset("examples", "lingala-dataset.jsonl")
```

---

## 🎯 Fine-tuning Best Practices

### 1. Dataset Quality
- ✅ Use diverse examples (basics, advanced, security)
- ✅ Include proper syntax in all examples
- ✅ Add comments explaining the code
- ✅ Include error handling examples
- ❌ Avoid incorrect syntax in training data

### 2. Dataset Size
- Minimum: 100 examples
- Recommended: 500-1000 examples
- Optimal: 2000+ examples

### 3. Hyperparameters
- Learning rate: 0.01-0.1
- Epochs: 3-5
- Batch size: 1-4
- Temperature: 0.7

### 4. Validation
- Use separate validation set
- Monitor for overfitting
- Test on unseen examples

---

## 📈 Evaluation

### Metrics to Track

1. **Syntax Accuracy:** % of generated code with correct syntax
2. **Semantic Correctness:** % of code that executes correctly
3. **Type Safety:** % of code with proper type annotations
4. **Security:** % of code using security libraries appropriately

### Evaluation Script

```python
def evaluate_model(model, test_examples):
    results = {
        "syntax_correct": 0,
        "semantic_correct": 0,
        "type_safe": 0,
        "security_aware": 0
    }
    
    for example in test_examples:
        generated = model.generate(example.prompt)
        
        # Check syntax
        if check_syntax(generated):
            results["syntax_correct"] += 1
        
        # Check semantics
        if check_semantics(generated):
            results["semantic_correct"] += 1
        
        # Check type safety
        if check_type_safety(generated):
            results["type_safe"] += 1
        
        # Check security
        if check_security(generated):
            results["security_aware"] += 1
    
    # Calculate percentages
    total = len(test_examples)
    for key in results:
        results[key] = (results[key] / total) * 100
    
    return results
```

---

## 🚀 Deployment

### Deploy to OpenRouter

1. **Prepare model:**
   - Export fine-tuned model
   - Create model card
   - Prepare documentation

2. **Submit to OpenRouter:**
   - Contact: support@openrouter.ai
   - Provide model files
   - Describe use case

3. **Get API endpoint:**
   - Receive model ID
   - Integrate with OpenRouter API

### Use via API

```javascript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "lingala-automation-fine-tuned",
    messages: [
      { role: "user", content: "Generate a secure login function in LingalaAutomation" }
    ]
  })
});
```

---

## 💡 Cost Estimation

### OpenAI Fine-tuning
- Dataset preparation: $0
- Fine-tuning (1000 examples): ~$20-50
- Inference: $0.008 per 1K tokens
- Total first month: ~$50-100

### OpenRouter with Custom Model
- Fine-tuning: $0 (if using local GPU)
- Deployment: Variable
- Inference: Depends on model
- Total first month: ~$20-50

### Local Ollama
- Fine-tuning: $0 (requires GPU)
- Deployment: $0
- Inference: $0
- Total first month: $0 (but requires hardware)

---

## 🎯 Recommendation

**For Immediate Use:**
- Use the system prompt wrapper (already created)
- No fine-tuning needed
- Works with existing models

**For Production:**
- Fine-tune with OpenAI (highest quality)
- Deploy to OpenRouter for easy access
- Monitor and improve continuously

**For Development:**
- Use Ollama with custom model
- Fine-tune locally
- Test extensively before deployment

---

## 📚 Resources

- OpenAI Fine-tuning: https://platform.openai.com/docs/guides/fine-tuning
- OpenRouter: https://openrouter.ai/docs
- Hugging Face Transformers: https://huggingface.co/docs/transformers
- Ollama: https://ollama.com/docs

---

**Next Steps:**
1. Prepare dataset from examples/ directory
2. Choose fine-tuning approach
3. Train and evaluate model
4. Deploy to OpenRouter
5. Integrate with wrapper API
