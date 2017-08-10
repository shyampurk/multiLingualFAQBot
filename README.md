# MultiLingual FAQBot

### MultiLingualFAQBot Using IBM's Retrieve and Rank API , Language Translation API

This repository contains the source code of a demo app that acts as a vertical search engine for a product manual. Cannon EOS550D camera user manual has been used as an example here. By parsing the camera manual through the Watson Retrieve and Rank API, this app provides a search interface to the users so that they can jump to the sections of the manual that contain the search words or phrases.It also provides Language translation from english to german , french and arabic.

# Demo Setup Overview

This README file contains the instructions for setting up the services for hosting the demo app. The demo app is a standalone web page whose code is available here

The following services are required to be setup for deploying the backend for this app

    Watson Document Conversion

    Watson Retrieve and Rank
    
    Watson Language Translator

    PubNub Blocks (Refer this README file )

You will need to clone this repository and must have a valid IBM and PubNub account. Both services offer free tier accounts for demo purposes. Once the services are setup, you can launch the app by opening the main index file in browser.

# Document Conversion Service - Setting up

## Step 1 :

Login to the Bluemix account with the valid credentials, and goto Catalog.

## Step 2 :

Select the Document Conversion Service under the Watson Services. 

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/doc_conv/doc_conversion_select.png)

## Step 3 :

Give the service name and scroll down the page,select the Free plan (you can see more about pricing options in that page) and click on the "create" button.

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/doc_conv/create_service.png)

## Step 4 :

Once you create the service, it will redirect you to the homepage of the service. There, click on the "Service Credentials" to get the apikey to access the Document Conversion api. Make a note of this API key.

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/doc_conv/get_cred.png)

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/doc_conv/create_success.png)


# Retrieve and Rank Service - Setting up

## Step 1 :

Login to the Bluemix account with the valid credentials, and goto Catalog.

## Step 2 :

Select the Retrieve and Rank Service under the Watson Services. 

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rr_select.png)

## Step 3 :

Give the service name and scroll down the page,select the Free plan (you can see more about pricing options in that page) and click on the "create" button.

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rr_create_service.png)

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rr_price_plan.png)

## Step 4 :

Once you create the service, it will redirect you to the homepage of the service. There, click on the "Service Credentials" to get the apikey to access the Retrieve and Rank API. Make a note of this API key.

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rr_cred.png)

# Language Translator Service - Setting up

## Step 1 :

Login to the Bluemix account with the valid credentials, and goto Catalog.

## Step 2 :

Select the Language Translator Service under the Watson Services. 

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/language_translator/select_service.png)

## Step 3 :

Give the service name and scroll down the page,select the Free plan (you can see more about pricing options in that page) and click on the "create" button.

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/language_translator/service_config.png)
![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/language_translator/price_plan.png)

## Step 4 :

Once you create the service, it will redirect you to the homepage of the service. There, click on the "Service Credentials" to get the apikey to access the Language Translator api. Make a note of this API key.

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/language_translator/service_cred_select.png)

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/language_translator/service_cred_view.png)

# Training the Retrieve and Rank API with Camera User Manual

## Step 1 : 

Open Watson's Retrieve and Rank Service [page](https://watson-retrieve-and-rank.ng.bluemix.net/) . Now we will create a solr cluster & collection and then upload the document and questions.

## Step 2 :

Select the Conversation Service you have created earlier steps

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rrConversionStart.png)

## Step 3 :

Select the Retrieve and Rank Service you have created earlier steps

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rrStart.png)

## Step 4 : Cluster Creation

Select the Create cluster button from the left side panel

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/creatingNewCluster.png)

## Step 5 :

Provide proper cluster name and specify the size of cluster

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/createCluster.png)

## Step 6 : Collection Creation

Select Create Collection button to setup a collection for our documents 

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/create_coll.png)

## Step 7 :

Set a collection name and select language type and click create

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/createCollection.png)

## Step 8 :

These are our cluster key and collection name

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rrcluster.png)

## Step 9 : Upload The Product Manual Document

Upload this [camera manual](eosrt2i-eos550d-im-en.pdf) to the collection

![alt-tag](https://github.com/shyampurk/multiLingualFAQBot/blob/master/screenshots/rank_retrieve/rr_uploaddoc.png)

## Step 10 : Upload Sample Query Question

Upload this set of sample questions [set1](canonEOS-550-Questions.txt) or [set2](newQuestionSet.txt) to the Retrieve and Rank Service
