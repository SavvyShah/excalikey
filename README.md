# ExcaliKey

[![Netlify Status](https://api.netlify.com/api/v1/badges/f5bf58ba-181e-4652-84b3-01ef390c8225/deploy-status)](https://app.netlify.com/sites/modest-jang-b2baeb/deploys)

I made this repository to understand how drawing apps work because I was very much inspired by Excalidraw and I wanted to build one myself. That's why the name Excalikey.

I am grateful to this wonderful site on geometric algorithms [Geomalgorithms](https://geomalgorithms.com/) which has fantastic explanations for many algorithms. [I talk about this in a later section of this Readme.](#implementing-the-select-feature)

[View App here](https://modest-jang-b2baeb.netlify.app/)

[View video walkthrough](https://www.screencast.com/t/sGdQswFn)

## Usage

You can draw various shapes and also change their fill and stroke after they are drawn by selecting them.

### General features

![General Features](/src/assets/docs/features-1.png)

From left to right the usage of icons is as follow

- Clears the whole screen
- Used to change the current fill color or fill color for a selected shape
- Same as fill icon but changes the border color

### Select options

![Select options](/src/assets/docs/features-2.png)

Apart from the general features we also have some options that you can choose to draw what you want

- Select a shape to change it's properties
- Draw a rectangle
- Draw a triangle

## Behind the app

### Implementing the select feature

This is a feature of the app that allows user to select shapes after they are drawn. A dotted line then surrounds the selected shape. I decided to implement this feature using the following logic.

For each click that happens I would get the coordinates of the point and try to find the shapes that contain the point. I would then report the last shape. I found a really cool website called [Geomalgorithms](https://geomalgorithms.com/) which guided me through implementing this feature.

I just had to do the following things:-
- For each shape I draw I needed to know it's [bounding box.](https://en.wikipedia.org/wiki/Minimum_bounding_box)
- Once I knew that each time I had to check if the point was there inside the shape I would check if it is inside the bounding box. If it was not inside the bounding box, it was not inside the shape too.
- Also for shapes except rectangles I had to check an extra condition to ensure the inclusion of point inside the shape called the winding number. An [intuitive definition](https://en.wikipedia.org/wiki/Winding_number#Intuitive_description) is given on wikipedia. Also check this another [article](https://geomalgorithms.com/a03-_inclusion.html) which is somewhat mathematical but highly recommended by me if you want to really get into the nitty gritty.

I have implemented them here and you can look into the code now.
- [Bounding Box](https://github.com/ShubhamCanMakeCommit/excalikey/blob/master/src/elements/index.ts#L108)
- [Winding number](https://github.com/ShubhamCanMakeCommit/excalikey/blob/master/src/elements/index.ts#L82)