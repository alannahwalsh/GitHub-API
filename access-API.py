from github import Github

# using username and password
# g = Github("alannahwalsh", "password")

# or using an access token
g = Github("82da445317a0a4ec2d72f8b9f1d85d74a9bf5440")

for repo in g.get_user().get_repos():
    print("-"*50)
    #print(" ")
    print(repo.name)
    #def print_repo(repo):
    # repository full name
    print("Full name:", repo.full_name)
    # the date of when the repo was created
    print("Date created:", repo.created_at)
    # programming language
    print("Language:", repo.language)
    #print(" ")
    # repository content (files & directories)
    print("Contents:")
    for content in repo.get_contents(""):
        print(content)
