//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "ProjectTableExtensionViewCell.h"
#import <QuartzCore/QuartzCore.h>
#import "ActionViewController.h"
#import <MobileCoreServices/MobileCoreServices.h>
#import "ProjectClientEx.h"

@interface ActionViewController ()

@property(strong,nonatomic) IBOutlet UIImageView *imageView;

@end

@implementation ActionViewController

ADAuthenticationContext* authContext;
NSString* authority;
NSString* redirectUriString;
NSString* resourceId;
NSString* clientId;
NSString* token;
NSDictionary* currentEntity;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    authority = [NSString alloc];
    resourceId = [NSString alloc];
    clientId = [NSString alloc];
    redirectUriString = [NSString alloc];
    
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    
    authority = [content objectForKey:@"authority"];
    resourceId = [content objectForKey:@"resourceId"];
    clientId = [content objectForKey:@"clientId"];
    redirectUriString = [content objectForKey:@"redirectUriString"];
    
    token = [NSString alloc];
    
    for (NSExtensionItem *item in self.extensionContext.inputItems) {
        for (NSItemProvider *itemProvider in item.attachments) {
            if ([itemProvider hasItemConformingToTypeIdentifier:(NSString *)kUTTypeURL]) {
                
                __weak ActionViewController *sself = self;
                
                [itemProvider loadItemForTypeIdentifier: (NSString *) kUTTypeURL
                                                options: 0
                                      completionHandler: ^(id<NSSecureCoding> item, NSError *error) {
                                          
                                          if (item != nil) {
                                              NSURL *url = item;
                                              sself.sharedUrl = [url absoluteString];
                                              
                                              [sself.urlTxt performSelectorOnMainThread : @ selector(setText : ) withObject:[url absoluteString] waitUntilDone:YES];
                                    
                                          }
                                          
                                      }];
                
            }
        }
    }
    
    [self performLogin:FALSE];
}

- (void) performLogin : (BOOL) clearCache{
    
    [self getToken:FALSE completionHandler:^(NSString *t){
        dispatch_async(dispatch_get_main_queue(), ^{
            if(t != nil)
            {
                token = t;
                
                [self loadData];
            }
            else
            {
                self.projectTable.hidden = true;
                self.selectProjectLbl.hidden = true;
                self.successMsg.hidden = false;
                self.successMsg.text = @"Login from the Research Project Tracker App before adding a Reference";
                self.successMsg.textColor = [UIColor redColor];
            }
        });
    }];
}


-(void) getToken : (BOOL) clearCache completionHandler:(void (^) (NSString*))completionBlock;
{
    ADAuthenticationError *error;
    authContext = [ADAuthenticationContext authenticationContextWithAuthority:authority
                                                                        error:&error];
    
    NSURL *redirectUri = [NSURL URLWithString:redirectUriString];
    
    if(clearCache){
        [authContext.tokenCacheStore removeAllWithError:nil];
    }
    
    [authContext acquireTokenSilentWithResource:resourceId
                                       clientId:clientId
                                    redirectUri:redirectUri
                                completionBlock:^(ADAuthenticationResult *result) {
                              if (AD_SUCCEEDED != result.status){
                                  // display error on the screen
                                  self.projectTable.hidden = true;
                                  self.selectProjectLbl.hidden = true;
                                  self.successMsg.hidden = false;
                                  self.successMsg.text = @"Login error";
                                  self.successMsg.textColor = [UIColor redColor];
                              }
                              else{
                                  completionBlock(result.accessToken);
                              }
                          }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)done {
    // Return any edited content to the host app.
    // This template doesn't do anything, so we just echo the passed in items.
    [self.extensionContext completeRequestReturningItems:self.extensionContext.inputItems completionHandler:nil];
}


-(void)loadData{
    //Create and add a spinner
    UIActivityIndicatorView* spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(135,140,50,50)];
    spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    [self.view addSubview:spinner];
    spinner.hidesWhenStopped = YES;
    [spinner startAnimating];
    
    ProjectClientEx *client = [[ProjectClientEx alloc] init];
    
    NSURLSessionTask* task = [client getProjectsWithToken:token andCallback:^(NSMutableArray *list, NSError *error) {
        
        if(!error){
            self.projectsList = list;
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.projectTable reloadData];
                [spinner stopAnimating];
            });
        }
        else {
            dispatch_async(dispatch_get_main_queue(), ^{
                self.projectTable.hidden = true;
                self.selectProjectLbl.hidden = true;
                self.successMsg.hidden = false;
                self.successMsg.text = @"Error retrieving data";
                self.successMsg.textColor = [UIColor redColor];
                [spinner stopAnimating];
            });
        }
        
    }];
    [task resume];
}

-(void)getProjectsFromList:(UIActivityIndicatorView *) spinner{
}


-(void)createProjectList:(UIActivityIndicatorView *) spinner{
}

- (IBAction)Login:(id)sender {
    [self performLogin:FALSE];
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSString* identifier = @"ProjectListCell";
    ProjectTableExtensionViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
    
    NSDictionary *item = [self.projectsList objectAtIndex:indexPath.row];
    cell.ProjectName.text = [item valueForKey:@"Title"];
    
    return cell;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.projectsList count];
}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 40;
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    UIActivityIndicatorView* spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(135,140,50,50)];
    spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
    [self.view addSubview:spinner];
    spinner.hidesWhenStopped = YES;
    
    [spinner startAnimating];
    
    currentEntity= [self.projectsList objectAtIndex:indexPath.row];
    
    NSString* obj = [NSString stringWithFormat:@"{'Url':'%@', 'Description':'%@'}", self.urlTxt.text, @""];
    NSDictionary* dic = [NSDictionary dictionaryWithObjects:@[obj, @"", [NSString stringWithFormat:@"%@", [currentEntity valueForKey:@"Id"]]] forKeys:@[@"URL", @"Comments", @"Project"]];
    
    __weak ActionViewController *sself = self;
    ProjectClientEx *client = [[ProjectClientEx alloc ] init];
    
    NSURLSessionTask* task =[client addReference:dic token:token callback:^(NSError *error) {
        if(error == nil){
            dispatch_async(dispatch_get_main_queue(), ^{
                sself.projectTable.hidden = true;
                sself.selectProjectLbl.hidden = true;
                sself.successMsg.hidden = false;
                sself.successMsg.text = [NSString stringWithFormat:@"Reference added successfully to the %@ Project.", [currentEntity valueForKey:@"Title"]];
                [spinner stopAnimating];
            });
        }
    }];
    
    [task resume];
}

@end
