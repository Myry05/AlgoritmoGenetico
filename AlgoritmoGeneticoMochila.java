import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;

public class AlgoritmoGeneticoMochila extends JFrame {
    private JTextField numItemsTextField;
    private JTextField capacidadTextField;
    private JTextArea resultadosTextArea;

    private JButton generarButton;
    private JButton resolverButton;

    private int[] pesos;
    private int[] valores;
    private int capacidadMochila;

    private static final int POPULATION_SIZE = 50;
    private static final double MUTATION_RATE = 0.1;
    private static final int MAX_GENERATIONS = 1000;

    public AlgoritmoGeneticoMochila() {
        setTitle("Algoritmo Genético - Problema de la Mochila");
        setSize(400, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel panel = new JPanel(new GridLayout(0, 2, 10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel numItemsLabel = new JLabel("Numero de Items:");
        numItemsTextField = new JTextField();
        JLabel capacidadLabel = new JLabel("Capacidad de la Mochila:");
        capacidadTextField = new JTextField();

        generarButton = new JButton("Generar");
        generarButton.addActionListener(e -> generarItems());

        JLabel resultadosLabel = new JLabel("Resultados:");
        resultadosTextArea = new JTextArea();
        resultadosTextArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(resultadosTextArea);

        resolverButton = new JButton("Resolver");
        resolverButton.addActionListener(e -> resolverProblema());

        panel.add(numItemsLabel);
        panel.add(numItemsTextField);
        panel.add(capacidadLabel);
        panel.add(capacidadTextField);
        panel.add(generarButton);
        panel.add(new JPanel()); // Espacio en blanco
        panel.add(resultadosLabel);
        panel.add(scrollPane);
        panel.add(new JPanel()); // Espacio en blanco
        panel.add(resolverButton);

        add(panel);
        setVisible(true);
    }

    private void generarItems() {
        int numItems = Integer.parseInt(numItemsTextField.getText());
        int capacidad = Integer.parseInt(capacidadTextField.getText());

        pesos = new int[numItems];
        valores = new int[numItems];

        JPanel inputPanel = new JPanel(new GridLayout(0, 3, 5, 5));
        for (int i = 0; i < numItems; i++) {
            JLabel pesoLabel = new JLabel("Peso " + (i + 1) + ":");
            JTextField pesoTextField = new JTextField();
            JLabel valorLabel = new JLabel("Valor " + (i + 1) + ":");
            JTextField valorTextField = new JTextField();

            inputPanel.add(pesoLabel);
            inputPanel.add(pesoTextField);
            inputPanel.add(valorLabel);
            inputPanel.add(valorTextField);
        }

        int result = JOptionPane.showConfirmDialog(this, inputPanel, "Ingrese pesos y valores", JOptionPane.OK_CANCEL_OPTION);
        if (result == JOptionPane.OK_OPTION) {
            for (int i = 0; i < numItems; i++) {
                pesos[i] = Integer.parseInt(((JTextField) inputPanel.getComponent(i * 4 + 1)).getText());
                valores[i] = Integer.parseInt(((JTextField) inputPanel.getComponent(i * 4 + 3)).getText());
            }
            capacidadMochila = capacidad;
            JOptionPane.showMessageDialog(this, "Items generados con exito.");
        }
    }

    private void resolverProblema() {
        if (pesos == null || valores == null) {
            JOptionPane.showMessageDialog(this, "Primero genera los items.");
            return;
        }

        AlgoritmoGenetico ag = new AlgoritmoGenetico(POPULATION_SIZE, MUTATION_RATE, pesos, valores, capacidadMochila);
        Individuo solucion = ag.ejecutarAlgoritmo(MAX_GENERATIONS);

        resultadosTextArea.setText("Solucion encontrada:\n" + solucion);
        resultadosTextArea.append("\nValor total: " + solucion.getValorTotal());
        resultadosTextArea.append("\nPeso total: " + solucion.getPesoTotal());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(AlgoritmoGeneticoMochila::new);
    }
}

class Individuo {
    private int[] cromosoma;
    private int valorTotal;
    private int pesoTotal;

    public Individuo(int[] cromosoma, int[] valores, int[] pesos) {
        this.cromosoma = cromosoma;
        calcularFitness(valores, pesos);
    }

    public int[] getCromosoma() {
        return cromosoma;
    }

    public int getValorTotal() {
        return valorTotal;
    }

    public int getPesoTotal() {
        return pesoTotal;
    }

    private void calcularFitness(int[] valores, int[] pesos) {
        valorTotal = 0;
        pesoTotal = 0;
        for (int i = 0; i < cromosoma.length; i++) {
            if (cromosoma[i] == 1) {
                valorTotal += valores[i];
                pesoTotal += pesos[i];
            }
        }
    }

    @Override
    public String toString() {
        return Arrays.toString(cromosoma);
    }
}

class AlgoritmoGenetico {
    private int tamPoblacion;
    private double tasaMutacion;
    private int[] pesos;
    private int[] valores;
    private int capacidadMochila;

    public AlgoritmoGenetico(int tamPoblacion, double tasaMutacion, int[] pesos, int[] valores, int capacidadMochila) {
        this.tamPoblacion = tamPoblacion;
        this.tasaMutacion = tasaMutacion;
        this.pesos = pesos;
        this.valores = valores;
        this.capacidadMochila = capacidadMochila;
    }

    public Individuo ejecutarAlgoritmo(int maxGeneraciones) {
        Random rand = new Random();
        Individuo[] poblacion = new Individuo[tamPoblacion];

        // Inicializar población aleatoria
        for (int i = 0; i < tamPoblacion; i++) {
            int[] cromosoma = new int[pesos.length];
            for (int j = 0; j < pesos.length; j++) {
                cromosoma[j] = rand.nextInt(2);
            }
            poblacion[i] = new Individuo(cromosoma, valores, pesos);
        }

        for (int gen = 0; gen < maxGeneraciones; gen++) {
            // Seleccionar padres (torneo binario)
            Individuo[] padres = new Individuo[2];
            for (int i = 0; i < 2; i++) {
                Individuo padre1 = poblacion[rand.nextInt(tamPoblacion)];
                Individuo padre2 = poblacion[rand.nextInt(tamPoblacion)];
                padres[i] = (padre1.getValorTotal() > padre2.getValorTotal()) ? padre1 : padre2;
            }

            // Cruzar padres para obtener hijos
            int puntoCorte = rand.nextInt(pesos.length);
            int[] hijo1 = new int[pesos.length];
            int[] hijo2 = new int[pesos.length];
            for (int i = 0; i < puntoCorte; i++) {
                hijo1[i] = padres[0].getCromosoma()[i];
                hijo2[i] = padres[1].getCromosoma()[i];
            }
            for (int i = puntoCorte; i < pesos.length; i++) {
                hijo1[i] = padres[1].getCromosoma()[i];
                hijo2[i] = padres[0].getCromosoma()[i];
            }

            // Aplicar mutación
            if (rand.nextDouble() < tasaMutacion) {
                int posMutacion = rand.nextInt(pesos.length);
                hijo1[posMutacion] = (hijo1[posMutacion] == 0) ? 1 : 0;
                posMutacion = rand.nextInt(pesos.length);
                hijo2[posMutacion] = (hijo2[posMutacion] == 0) ? 1 : 0;
            }

            // Reemplazar peores individuos en la población
            poblacion = reemplazarPeores(poblacion, new Individuo(hijo1, valores, pesos), new Individuo(hijo2, valores, pesos));
        }

        // Seleccionar el mejor individuo de la última generación como solución
        Individuo mejorIndividuo = poblacion[0];
        for (Individuo individuo : poblacion) {
            if (individuo.getValorTotal() > mejorIndividuo.getValorTotal()) {
                mejorIndividuo = individuo;
            }
        }

        return mejorIndividuo;
    }

    private Individuo[] reemplazarPeores(Individuo[] poblacion, Individuo hijo1, Individuo hijo2) {
        Individuo peor1 = poblacion[0];
        Individuo peor2 = poblacion[1];
        for (Individuo individuo : poblacion) {
            if (individuo.getValorTotal() < peor1.getValorTotal()) {
                peor2 = peor1;
                peor1 = individuo;
            } else if (individuo.getValorTotal() < peor2.getValorTotal()) {
                peor2 = individuo;
            }
        }

        if (hijo1.getValorTotal() > peor1.getValorTotal()) {
            poblacion[poblacion.length - 2] = hijo1;
        } else if (hijo1.getValorTotal() > peor2.getValorTotal()) {
            poblacion[poblacion.length - 2] = hijo1;
        }

        if (hijo2.getValorTotal() > peor1.getValorTotal()) {
            poblacion[poblacion.length - 1] = hijo2;
        } else if (hijo2.getValorTotal() > peor2.getValorTotal()) {
            poblacion[poblacion.length - 1] = hijo2;
        }

        return poblacion;
    }
}
