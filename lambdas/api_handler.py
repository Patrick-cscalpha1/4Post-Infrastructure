import json
import boto3
import os
from boto3.dynamodb.conditions import Key
import secrets
import string
import time
from datetime import datetime

def lambda_handler(event, context):

    a=str(event['pathParameters'])
    b=str(event['body'])

    path=event['pathParameters']['proxy'].split("/")[len(event['pathParameters']['proxy'].split("/"))-1]

    if type(event['body'])==str:
        par=json.loads(event['body'])
    else:
        par=event['body']

    if path=="login":
        text=api_login(par)
    elif path=="register":
        text=api_register(par)
    elif path=="posts":
        text=api_posts(par)
    elif path=="singlepost":
        text=api_singlepost(par)
    elif path=="addcomment":
        text=api_addcomment(par)
    elif path=="profile":
        text=api_profile(par)
    elif path=="follow":
        text=api_follow(par)
    elif path=="addpost":
        text=api_addpost(par)
    elif path=="like":
        text=api_like(par)        
    else:
        text="Path not found"

    return {
        'statusCode': 200,
        'headers':{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True
        },
        'body': text,
    }


def id_char():
    return "-"

def user_code():
    return "u"+id_char()

def session_code():
    return "s"+id_char()

def post_code():
    return "p"+id_char()

def comment_code():
    return "c"+id_char()

def table_name():
    return "social"


def get_table():
    
    dynamodb = boto3.resource('dynamodb')
    
    return dynamodb.Table(os.environ['TABLE_NAME'])


def api_login(par):

    #Must check the database if the credentials match.
    #If so, the API should create a new session, associate the id of the user to that session, 
    #and respond with the sessionid (plain text, not json)
    #If the credentials do not match, reply with the word "error"
    
    table = get_table()

    username=par['username']
    password=par['password']

    response = table.get_item(
        
        Key={
            'PK':user_code()+username,
            'SK':password
        },
    )

    success=False

    try:
        response['Item']
        success=True
    except:
        pass

    if success:
        token=session_code()+secrets.token_hex(16)
        input1 = {'PK': token, 'SK': user_code()+username}
        table.put_item(Item=input1)
        text=token
    else:
        text="error"

    return text



def api_register(par):
    
    table = get_table()

    username=par['username']
    password=par['password']
    description=par['description']

    input1 = {'PK': user_code()+username, 'SK': 'info', 'role': 'User', 'description': description}
    input2 = {'PK': user_code()+username, 'SK': 'count', 'follower':0, 'following': 0, 'post': 0}
    input3 = {'PK': user_code()+username, 'SK': password}

    input4 = {'PK': user_code()+username+id_char()+"following", 'SK': user_code()+username}
    input5 = {'PK': user_code()+username+id_char()+"follower", 'SK': user_code()+username}

    table.put_item(Item=input1)
    table.put_item(Item=input2)
    table.put_item(Item=input3)
    table.put_item(Item=input4)
    table.put_item(Item=input5)

    table.update_item(
        Key = {
            'PK': user_code()+username,
            'SK': 'count',
        },
        ExpressionAttributeValues = { ':inc': 1 },
        UpdateExpression = "ADD follower :inc"
    )

    table.update_item(
        Key = {
            'PK': user_code()+username,
            'SK': 'count',
        },
        ExpressionAttributeValues = { ':inc': 1 },
        UpdateExpression = "ADD following :inc"
    )

    return "ok"


def user_by_session(token):
    
    table = get_table()

    filtering_exp = Key("PK").eq(token)
    
    try:
        return table.query(KeyConditionExpression=filtering_exp)['Items'][0]['SK']
    except:
        return None



def api_posts(par):

    #The API must respond, in JSON format, with posts created by users that the userid follows.
    #(check in the database which users are followed by the userid, then get the posts)
    #The format in the example must be respected

    table = get_table()

    user=user_by_session(par['sessionid'])

    filtering_exp = Key("PK").eq(user+"-following")

    try:
        following=table.query(KeyConditionExpression=filtering_exp)['Items']
    except:
        following=[]

    total_posts = []
    i=0
    for i in range(len(following)):
        filtering_exp = Key("PK").eq(following[i]['SK']+"-post")
        posts=table.query(KeyConditionExpression=filtering_exp)['Items']
        j=0
        for j in range(len(posts)):
            response = table.get_item(
                
                Key={
                    'PK': posts[j]['SK'],
                    'SK': 'info'
                },
            )

            response2 = table.get_item(
                
                Key={
                    'PK': posts[j]['SK'],
                    'SK': 'count'
                },
            )

            f = Key("PK").eq(user+id_char()+"likes")
            likes=table.query(KeyConditionExpression=f)

            liked=False

            try:
                k=0
                for k in range(len(likes['Items'])):
                    if likes['Items'][k]['SK']==posts[j]['SK']:
                        liked=True
                        break
            except:
                liked=False

            obj = {

                'id': posts[j]['SK'],
                'userid': response['Item']['author'],
                'username': response['Item']['author'].replace(user_code(),""),
                'title': response['Item']['title'],
                'phrase': response['Item']['text'],
                'date': datetime.fromtimestamp(int(response['Item']['timestamp'])).strftime('%Y-%m-%d'),
                'like': liked,
                'likes': int(response2['Item']['likes'])

            }

            total_posts.append(obj)

    text=json.dumps(total_posts)

    return text



def api_singlepost(par):

    #The API must respond, in JSON format, with information and comments relating to the post associated with the postid.
    #The format in the example must be respected

    table = get_table()

    postid=par['postid']
    user=user_by_session(par['sessionid'])

    response = table.get_item(
        
        Key={
            'PK': postid,
            'SK': 'info'
        },
    )

    response2 = table.get_item(
        
        Key={
            'PK': postid,
            'SK': 'count'
        },
    )

    f = Key("PK").eq(user+id_char()+"likes")
    likes=table.query(KeyConditionExpression=f)

    liked=False

    try:
        k=0
        for k in range(len(likes['Items'])):
            if likes['Items'][k]['SK']==postid:
                liked=True
                break
    except:
        liked=False

    post_info = {

        'id': postid,
        'userid': response['Item']['author'],
        'username': response['Item']['author'].replace(user_code(),""),
        'title': response['Item']['title'],
        'phrase': response['Item']['text'],
        'date': datetime.fromtimestamp(int(response['Item']['timestamp'])).strftime('%Y-%m-%d'),
        'like': liked,
        'likes': int(response2['Item']['likes'])

    }

    comments=[]

    f = Key("PK").eq(postid+id_char()+"comments")
    c=table.query(KeyConditionExpression=f)

    try:
        k=0
        for k in range(len(c['Items'])):
            obj = {
                'commentid': c['Items'][k]['SK'],
                'userid': c['Items'][k]['user'],
                'username': c['Items'][k]['user'].replace(user_code(),""),
                'comment': c['Items'][k]['text'],
                'date': datetime.fromtimestamp(int(c['Items'][k]['timestamp'])).strftime('%Y-%m-%d')
            }

            comments.append(obj)
    except:
        pass
    
    post_info['comments'] = comments

    text=json.dumps(post_info)
    
    return text


def api_addcomment(par):

    table = get_table()
    
    user=user_by_session(par['sessionid'])
    comment=par['comment']
    postid=par['postid']

    commentid=''.join(secrets.choice(string.digits)for i in range(8))
    input1 = {'PK': postid+id_char()+"comments", 'SK': comment_code()+commentid,'timestamp':int(time.time()), 'user': user, 'text':comment}

    table.put_item(Item=input1)

    return "ok"


def api_profile(par):

    #The API must respond with some information regarding the user associated with the userid.
    #It also needs to check whether the logged in user follows the userid or not (then provide it as a response in the "followed" field).
    #The format in the example must be respected

    table = get_table()

    user=user_by_session(par['sessionid'])
    userid=par['userid']

    response = table.get_item(
        
        Key={
            'PK': userid,
            'SK': 'info'
        },
    )

    response2 = table.get_item(
        
        Key={
            'PK': userid,
            'SK': 'count'
        },
    )

    f = Key("PK").eq(user+id_char()+"following")
    u=table.query(KeyConditionExpression=f)

    following=False

    try:
        i=0
        for i in range(len(u)):
            if u['Items'][i]['SK']==userid:
                following=True
                break
    except:
        pass


    profile = {

        'username': userid.replace(user_code(),""),
        'description': response['Item']['description'],
        'role': response['Item']['role'],
        'followed': following,
        'follower': int(response2['Item']['follower']),
        'following': int(response2['Item']['following'])

    }
    print(profile)

    text=json.dumps(profile)
    
    return text



def api_follow(par):

    table = get_table()

    user=user_by_session(par['sessionid'])
    follow=par['follow'] #true for follow, false for unfollow
    userid=par['userid']

    if follow:
        input1 = {'PK': user+id_char()+"following", 'SK': userid}
        input2 = {'PK': userid+id_char()+"follower", 'SK': user}

        table.put_item(Item=input1)
        table.put_item(Item=input2)
        inc=1
    else:
        response = table.delete_item(
            Key={
                'PK': user+id_char()+"following",
                'SK': userid
            }
        )

        response = table.delete_item(
            Key={
                'PK': userid+id_char()+"follower",
                'SK': user
            }
        )
        inc=-1

    table.update_item(
        Key = {
            'PK': userid,
            'SK': 'count',
        },
        ExpressionAttributeValues = { ':inc': inc },
        UpdateExpression = "ADD follower :inc"
    )

    table.update_item(
        Key = {
            'PK': user,
            'SK': 'count',
        },
        ExpressionAttributeValues = { ':inc': inc },
        UpdateExpression = "ADD following :inc"
    )

    return "ok"


def api_addpost(par):

    table = get_table()

    user=user_by_session(par['sessionid'])
    title=par['title']
    phrase=par['phrase']
    postid=''.join(secrets.choice(string.digits)for i in range(8))
    timestamp=int(time.time())

    input1 = {'PK': post_code()+postid, 'SK': 'info', 'timestamp': timestamp, 'text': phrase, 'title': title, 'author': user}
    input2 = {'PK': post_code()+postid, 'SK': 'count', 'likes': 0}
    input3 = {'PK': user+id_char()+"post", 'SK': post_code()+postid}

    table.put_item(Item=input1)
    table.put_item(Item=input2)
    table.put_item(Item=input3)

    return "ok"


def api_like(par):

    #The API must set in the database that the user likes (or unlikes) a certain post
    #It can provide a simple "ok" in plain text as a response

    table = get_table()

    user=user_by_session(par['sessionid'])
    postid=par['postid']
    like=par['like'] #true for like, false for removing the like

    if like:
        input1 = {'PK': user+id_char()+"likes", 'SK': postid}
        table.put_item(Item=input1)
        inc=1
    else:
        response = table.delete_item(
            Key={
                'PK': user+id_char()+"likes",
                'SK': postid
            }
        )
        inc=-1

    table.update_item(
        Key = {
            'PK': postid,
            'SK': 'count',
        },
        ExpressionAttributeValues = { ':inc': inc },
        UpdateExpression = "ADD likes :inc"
    )

    return "ok"