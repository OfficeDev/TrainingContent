#import "ViewController.h"

@interface FileDetailsViewController : ViewController
@property (weak, nonatomic) IBOutlet UILabel *fileName;
@property (weak, nonatomic) IBOutlet UILabel *lastModified;
@property (weak, nonatomic) IBOutlet UILabel *created;
- (IBAction)downloadAction:(id)sender;

@property (nonatomic) UIActivityIndicatorView* spinner;

@end
