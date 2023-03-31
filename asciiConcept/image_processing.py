import cv2
import numpy as np

img = cv2.imread("vader.jpg")

askii_brightness = {

    0.0 : "一",
    0.125 :"二",
    0.25 : "木",
    0.375 : "四",
    0.5 : "品",
    0.625 : "林",
    0.75  : "是",
    0.875 : "晨",
    1.0 : "麟"

}

resized_img = cv2.resize(img, (500,500), interpolation= cv2.INTER_AREA)
# cv2.imshow("image resized", resized_img)

askii_array = np.zeros((500,500), dtype = str)
i = 0
for row in resized_img:
    j = 0
    for elt in row:
        askii_array[i][j] = askii_brightness[round((sum(elt)/(255*3))*8)/8]
        j += 1
    i += 1
for row in askii_array:
    string = ""
    for character in row:
        string += character
    print(string + "<br>")

# cv2.waitKey(0)



#"C:\Users\augus\software_development\askii_concept\person1.jpg"