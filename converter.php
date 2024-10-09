<?php

function loadJsonFile($filename) {
    $json = file_get_contents($filename);
    return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
}

function convert(string $original, string $output): void
{
    $data = loadJsonFile($original);

    $questions = [];
    $currentQuestion = [
        'number' => '',
        'text' => '',
        'answers' => [],
        'correct' => ''
    ];
    $errors = 0;

    foreach ($data as $item) {
        if(empty($item)) {
            continue;
        }

        if (isset($item['Column1']) || isset($item['Column2'])) {

            if(empty($item['Column3'])) {
                continue;
            }

            if (!empty($currentQuestion['number']) && !empty($currentQuestion['text'])) {
                if (count($currentQuestion['answers']) != 4) {
                    $errors++;
                }
                $questions[] = $currentQuestion;
                $currentQuestion = [
                    'number' => '',
                    'text' => '',
                    'answers' => [],
                    'correct' => ''
                ];
            }

            $currentQuestion['number'] = $item['Column1'] ?? $currentQuestion['number'];
            $currentQuestion['text'] = $item['Column2'] ?? $currentQuestion['text'];
        }

        $currentQuestion['answers'][] = $item['Column3'];
        if ($item['Column4'] == 'правильна') {
            $currentQuestion['correct'] = $item['Column3'];
        }
    }

    if ($currentQuestion) {
        $questions[] = $currentQuestion;
    }

    $outputJson = json_encode($questions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    file_put_contents($output, $outputJson);
    echo "Преобразование завершено.\n";
    echo "Ошибок: {$errors}\n";
}

function combine($file1, $file2, $output)
{
    $file1 = loadJsonFile($file1);
    $file2 = loadJsonFile($file2);

    foreach ($file2 as &$item) {
        $item['number'] = 10000 + $item['number'];
    }

    $combined = array_merge($file1, $file2);
    file_put_contents($output, json_encode($combined, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "Файлы успешно объединены!";
}


convert('original1.json', 'questions1.json');
convert('original2.json', 'questions2.json');
combine('questions1.json', 'questions2.json', 'questions.json');

