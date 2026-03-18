# TPU Visualizer

An interactive and educational web application designed to visually explain and demonstrate the architecture, features, and generational evolutions of Google's Tensor Processing Units (TPUs).

## 🚀 Features

- **Systolic Array Interactive Demo**: A vivid, animated representation of how the TPU's matrix engine calculates and accumulates partial sums (MAC) continuously in one direction.
- **5 Pillars of TPU Architecture**: Deep-dive feature cards highlighting Google's hardware innovations:
  1. **Systolic Array** (Data Conveyor Belt Matrix Engine)
  2. **Pod Supercomputers** (2D/3D Torus Topologies)
  3. **ICI** (Inter-Chip Interconnect Optical Networking)
  4. **SparseCore** (Specialized Embedding Fetchers for Recommendations)
  5. **HBM** (High Bandwidth Memory)
- **Scrollytelling Architecture**: Step-by-step interactive scroll explanations covering Host CPU, VMEM, Vector Processing Units (VPU), and MXUs.
- **Generational Evolution**: Complete timeline and precise hardware specifications covering TPU v2 through Trillium (v6e).
- **Fully Internationalized (i18n)**: Seamlessly toggle between comprehensive English and Korean localizations with accurately maintained technical context.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18, React Router v6
- **Styling & Animations**: Tailwind CSS with custom SVG animations powered by Framer Motion
- **Build Tooling**: Vite, TypeScript
- **Internationalization**: `react-i18next`

## 🏃‍♂️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jinseo-jang/tpu-visualizer.git
   cd tpu-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will automatically launch at `http://localhost:5173`.

## 📖 Learn More
Built to provide an intuitive understanding of the complex hardware ecosystems enabling large language models and modern deep learning at scale.
