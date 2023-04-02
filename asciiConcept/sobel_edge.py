import cv2

img = cv2.imread('person2.jpg')
cv2.imshow('Original Image', img)
cv2.waitKey(0)

grayscale_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imshow('Gray Scale Image', grayscale_img)
cv2.waitKey(0)

gaussianblur_img = cv2.GaussianBlur(grayscale_img, (3,3),10)
cv2.imshow('Blurred Image', gaussianblur_img)
cv2.waitKey(0)

sobelx = cv2.Sobel(src = gaussianblur_img, ddepth = cv2.CV_64F, dx = 1, dy = 0, ksize = 5)
cv2.imshow("Sobel X", sobelx)
cv2.waitKey(0)

sobelxy = cv2.Sobel(src = gaussianblur_img, ddepth = cv2.CV_64F, dx = 1, dy = 1, ksize = 5)
cv2.imshow("Sobel xy", sobelxy)
cv2.waitKey(0)