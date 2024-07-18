<?php
// Чтение JSON файла
$inputJson = file_get_contents('original.json');
$data = json_decode($inputJson, true);

$questions = [];
$currentQuestion = [
    'number' => '',
    'text' => '',
    'answers' => [],
    'correct' => ''
];
$errors = 0;

foreach ($data as $item) {
    if (isset($item['Column1']) || isset($item['Column2'])) {
        if (!empty($currentQuestion['number']) && !empty($currentQuestion['text'])) {
            if(count($currentQuestion['answers']) != 4) {
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

            $currentQuestion['number'] = isset($item['Column1']) ? $item['Column1'] : $currentQuestion['number'];
            $currentQuestion['text'] = isset($item['Column2']) ? $item['Column2'] : $currentQuestion['text'];
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

// Запись JSON в файл
file_put_contents('output.json', $outputJson);

echo "Преобразование завершено.\n";
echo "Ощибок: .{$errors}\n";
?>
