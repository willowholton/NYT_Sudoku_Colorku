import requests
import json
import matplotlib.pyplot as pyplot


url = "https://www.nytimes.com/puzzles/sudoku/"
page = requests.get(url)
text = page.text
search = "gameData = "
start = text.find(search) + len(search)
obj, end_idx = json.JSONDecoder().raw_decode(text, start)

colors = ['white', 'crimson','orange','gold','limegreen','darkgreen','lightskyblue','mediumblue','mediumpurple','rebeccapurple']
levels = ['easy', 'medium', 'hard']

puzzle_data = {}
puzzle_data['day'] = obj['easy']['day_of_week']
puzzle_data['date'] = obj['easy']['print_date']
puzzle_data['displayDate'] = obj['displayDate']

for diff in levels:
    # Get puzzle data
    puzzle_data[diff] = {}
    puzzle_data[diff]['given'] = [obj[diff]['puzzle_data']['puzzle'][i : i + 9] for i in range(0, 81, 9)]
    puzzle_data[diff]['solution'] = [obj[diff]['puzzle_data']['solution'][i : i + 9] for i in range(0, 81, 9)]

    # Generate puzzle images
    file_path = 'Puzzles/' + puzzle_data['date'] + ' ' + diff + '.png'
    fig, ax = pyplot.subplots(figsize=(11,11))
    ax.set_aspect("equal")
    ax.set_axis_off()
    ax.set_xlim(0, 9)
    ax.set_ylim(0, 9)
    
    for i in range(10):
        if (i % 3 == 0):
            ax.plot([0,9], [i,i], color="black", linewidth=5)
            ax.plot([i,i], [0,9], color="black", linewidth=5)
        else: 
            ax.plot([0,9], [i,i], color="black", linewidth=1.5)
            ax.plot([i,i], [0,9], color="black", linewidth=1.5)
    
    for i in range(9):
        for j in range(9):
            value = puzzle_data[diff]['given'][i][j]
            if (value != 0):
                circle = pyplot.Circle(xy=(j+0.5, 9-i-1+0.5), radius=0.25, color=colors[value], fill=True)
                ax.add_patch(circle)
                
    # Save puzzle image
    pyplot.savefig(file_path, bbox_inches='tight', pad_inches=0.25)


# Generate puzzle data json
with open('Colorku/src/data/puzzles.json', 'w') as f:
    json.dump(puzzle_data, f, indent=2)